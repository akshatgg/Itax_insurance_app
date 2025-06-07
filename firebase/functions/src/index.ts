import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as cors from "cors"

// Initialize Firebase Admin
admin.initializeApp()

// Initialize Firestore
const db = admin.firestore()
const corsHandler = cors({ origin: true })

// Process OCR results and update document data
export const processOCRResult = functions.https.onRequest((request: { body: { userId: any; documentType: any; ocrResult: any; imageUrl: any } }, response: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; success?: boolean; documentId?: any; message?: string }): any; new(): any } } }) => {
  corsHandler(request, response, async () => {
    try {
      const { userId, documentType, ocrResult, imageUrl } = request.body

      if (!userId || !documentType || !ocrResult) {
        return response.status(400).json({ error: "Missing required fields" })
      }

      // Create a new document scan record
      const docRef = await db.collection("documentScans").add({
        userId,
        documentType,
        fields: ocrResult.fields,
        fullText: ocrResult.fullText,
        imageUrl: imageUrl || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "processed",
      })

      // If this is a verification document, update user's verification status
      if (documentType === "pan" || documentType === "aadhaar") {
        await db
          .collection("users")
          .doc(userId)
          .update({
            [`${documentType}Verified`]: true,
            [`${documentType}VerifiedAt`]: admin.firestore.FieldValue.serverTimestamp(),
          })
      }

      return response.status(200).json({
        success: true,
        documentId: docRef.id,
        message: "OCR result processed successfully",
      })
    } catch (error) {
      console.error("Error processing OCR result:", error)
      return response.status(500).json({ error: "Failed to process OCR result" })
    }
  })
})

// Verify eKYC data and update user verification status
export const verifyEKYC = functions.https.onRequest((request: { body: { userId: any; aadhaarNumber: any; ekycData: any } }, response: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; success?: boolean; verificationId?: any; message?: string }): any; new(): any } } }) => {
  corsHandler(request, response, async () => {
    try {
      const { userId, aadhaarNumber, ekycData } = request.body

      if (!userId || !aadhaarNumber || !ekycData) {
        return response.status(400).json({ error: "Missing required fields" })
      }

      // Create a new eKYC verification record
      const verificationRef = await db.collection("ekycVerifications").add({
        userId,
        aadhaarNumber,
        name: ekycData.name,
        dob: ekycData.dob,
        gender: ekycData.gender,
        address: ekycData.address,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "verified",
      })

      // Update user's verification status
      await db.collection("users").doc(userId).update({
        isEkycVerified: true,
        ekycVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      return response.status(200).json({
        success: true,
        verificationId: verificationRef.id,
        message: "eKYC verification processed successfully",
      })
    } catch (error) {
      console.error("Error processing eKYC verification:", error)
      return response.status(500).json({ error: "Failed to process eKYC verification" })
    }
  })
})

// Generate a policy number for approved insurance applications
export const generatePolicyNumber = functions.firestore
  .document("insuranceApplications/{applicationId}")
  .onUpdate(async (change: { after: { data: () => any; ref: { update: (arg0: { policyNumber: string; approvedAt: any }) => any } }; before: { data: () => any } }, context: { params: { applicationId: any } }) => {
    const newData = change.after.data()
    const previousData = change.before.data()

    // Only proceed if status changed from pending to approved
    if (previousData.status === "pending" && newData.status === "approved" && !newData.policyNumber) {
      try {
        // Generate a unique policy number
        const prefix = getPolicyPrefix(newData.insuranceType)
        const timestamp = Date.now().toString().substring(6)
        const random = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")
        const policyNumber = `${prefix}-${timestamp}-${random}`

        // Update the application with the policy number
        await change.after.ref.update({
          policyNumber,
          approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        })

        // Create a new policy document
        const policyData = {
          userId: newData.userId,
          applicationId: context.params.applicationId,
          policyNumber,
          insuranceType: newData.insuranceType,
          personalInfo: newData.personalInfo,
          vehicleInfo: newData.vehicleInfo,
          coverageInfo: newData.coverageInfo,
          premium: newData.premium,
          startDate: newData.coverageInfo.startDate,
          endDate: new Date(
            new Date(newData.coverageInfo.startDate).setFullYear(
              new Date(newData.coverageInfo.startDate).getFullYear() + 1,
            ),
          ),
          status: "active",
          documents: {
            policyDocument: null,
            receiptDocument: null,
          },
          payments: [],
          claims: [],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }

        await db.collection("insurancePolicies").add(policyData)

        // Send notification to the user
        await db.collection("notifications").add({
          userId: newData.userId,
          title: "Insurance Application Approved",
          message: `Your insurance application has been approved. Policy Number: ${policyNumber}`,
          type: "policy_approval",
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })

        console.log(`Policy number ${policyNumber} generated for application ${context.params.applicationId}`)
      } catch (error) {
        console.error("Error generating policy number:", error)
      }
    }
  })

// Helper function to get policy prefix based on insurance type
function getPolicyPrefix(insuranceType: string): string {
  switch (insuranceType) {
    case "auto":
      return "AUTO"
    case "health":
      return "HLTH"
    case "life":
      return "LIFE"
    case "home":
      return "HOME"
    default:
      return "INS"
  }
}

// Process claim submission and update policy
export const processClaimSubmission = functions.firestore
  .document("claims/{claimId}")
  .onCreate(async (snapshot: { data: () => any; ref: { update: (arg0: { claimNumber: string; status: string; submittedAt: any }) => any } }, context: { params: { claimId: any } }) => {
    const claimData = snapshot.data()

    try {
      // Generate a unique claim number
      const claimNumber = `CLM-${Date.now().toString().substring(6)}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`

      // Update the claim with the claim number
      await snapshot.ref.update({
        claimNumber,
        status: "pending",
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      // Update the policy with the new claim
      const policyRef = db.collection("insurancePolicies").doc(claimData.policyId)
      const policyDoc = await policyRef.get()

      if (policyDoc.exists) {
        const policyData = policyDoc.data()
        const claims = policyData?.claims || []

        claims.push({
          id: context.params.claimId,
          claimNumber,
          date: admin.firestore.FieldValue.serverTimestamp(),
          amount: claimData.amount,
          reason: claimData.reason,
          status: "pending",
          documents: claimData.documents,
        })

        await policyRef.update({ claims })
      }

      // Send notification to the user
      await db.collection("notifications").add({
        userId: claimData.userId,
        title: "Claim Submitted",
        message: `Your claim has been submitted successfully. Claim Number: ${claimNumber}`,
        type: "claim_submission",
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      console.log(`Claim number ${claimNumber} generated for claim ${context.params.claimId}`)
    } catch (error) {
      console.error("Error processing claim submission:", error)
    }
  })
