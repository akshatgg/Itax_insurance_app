import * as firebase from "firebase/app"
import "firebase/firestore"
import { firebaseConfig } from "../src/config/firebase"

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app()
}

const db = firebase.firestore()

/**
 * Setup Firestore collections and initial data
 */
async function setupFirestoreDatabase() {
  console.log("🔥 Setting up Firestore database...")

  try {
    // Create collections with sample documents
    await createCollections()

    // Create composite indexes
    await createIndexes()

    // Add sample data
    await addSampleData()

    console.log("✅ Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
  }
}

/**
 * Create all required collections
 */
async function createCollections() {
  console.log("📁 Creating collections...")

  const collections = [
    "users",
    "insuranceApplications",
    "insurancePolicies",
    "claims",
    "documentScans",
    "ekycVerifications",
    "familyMembers",
    "notifications",
    "payments",
  ]

  // Create each collection with a placeholder document that we'll delete later
  const batch = db.batch()

  for (const collection of collections) {
    const docRef = db.collection(collection).doc("placeholder")
    batch.set(docRef, {
      placeholder: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
  console.log("✅ Collections created successfully")
}

/**
 * Create required composite indexes
 */
async function createIndexes() {
  console.log("🔍 Creating indexes...")

  // Note: Composite indexes need to be created in the Firebase console
  // or using the Firebase CLI. This function is a placeholder to remind
  // you which indexes to create.

  console.log(`
    Please create the following indexes in the Firebase console:
    
    1. Collection: insuranceApplications
       Fields: userId (ASC), status (ASC), createdAt (DESC)
       
    2. Collection: insurancePolicies
       Fields: userId (ASC), status (ASC), endDate (ASC)
       
    3. Collection: claims
       Fields: userId (ASC), status (ASC), submittedAt (DESC)
       
    4. Collection: documentScans
       Fields: userId (ASC), documentType (ASC), createdAt (DESC)
       
    5. Collection: notifications
       Fields: userId (ASC), read (ASC), createdAt (DESC)
  `)

  console.log("⚠️ Please create these indexes manually in the Firebase console")
}

/**
 * Add sample data for testing
 */
async function addSampleData() {
  console.log("📊 Adding sample data...")

  // First, delete placeholder documents
  const collections = [
    "users",
    "insuranceApplications",
    "insurancePolicies",
    "claims",
    "documentScans",
    "ekycVerifications",
    "familyMembers",
    "notifications",
    "payments",
  ]

  for (const collection of collections) {
    try {
      await db.collection(collection).doc("placeholder").delete()
    } catch (error) {
      console.error(`Error deleting placeholder for ${collection}:`, error)
    }
  }

  // Add sample user
  const userRef = db.collection("users").doc("sample-user-id")
  await userRef.set({
    email: "user@example.com",
    displayName: "Sample User",
    phoneNumber: "+919876543210",
    dateOfBirth: "1990-01-01",
    gender: "male",
    address: {
      line1: "123 Main Street",
      line2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    panVerified: false,
    aadhaarVerified: false,
    isEkycVerified: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })

  // Add sample insurance application
  const applicationRef = db.collection("insuranceApplications").doc("sample-application-id")
  await applicationRef.set({
    userId: "sample-user-id",
    insuranceType: "auto",
    personalInfo: {
      name: "Sample User",
      email: "user@example.com",
      phone: "+919876543210",
      dateOfBirth: "1990-01-01",
      address: {
        line1: "123 Main Street",
        line2: "Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
      },
    },
    vehicleInfo: {
      make: "Honda",
      model: "City",
      year: 2020,
      registrationNumber: "MH01AB1234",
      chassisNumber: "MRHGM6860KP209930",
      engineNumber: "P2L3H4012345",
    },
    coverageInfo: {
      coverageType: "comprehensive",
      addOns: ["zero_dep", "roadside_assistance"],
      startDate: new Date("2023-01-01"),
      idv: 800000,
    },
    premium: {
      basePremium: 12000,
      tax: 2160,
      discounts: 1000,
      totalPremium: 13160,
    },
    documents: {
      rcCopy: "https://firebasestorage.googleapis.com/sample-rc-copy.pdf",
      drivingLicense: "https://firebasestorage.googleapis.com/sample-dl.pdf",
    },
    status: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })

  // Add sample document scan
  const scanRef = db.collection("documentScans").doc("sample-scan-id")
  await scanRef.set({
    userId: "sample-user-id",
    documentType: "pan",
    fields: {
      panNumber: "ABCDE1234F",
      name: "SAMPLE USER",
      fatherName: "FATHER NAME",
      dateOfBirth: "01/01/1990",
    },
    fullText:
      "INCOME TAX DEPARTMENT\nGOVT. OF INDIA\nPermanent Account Number\nABCDE1234F\nSAMPLE USER\nFATHER NAME\n01/01/1990",
    imageUrl: "https://firebasestorage.googleapis.com/sample-pan-image.jpg",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    status: "processed",
  })

  // Add sample notification
  const notificationRef = db.collection("notifications").doc("sample-notification-id")
  await notificationRef.set({
    userId: "sample-user-id",
    title: "Welcome to EcoSure",
    message: "Thank you for registering with EcoSure Insurance. Complete your profile to get started.",
    type: "welcome",
    read: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  })

  // Add sample family member
  const familyMemberRef = db.collection("familyMembers").doc("sample-family-member-id")
  await familyMemberRef.set({
    userId: "sample-user-id",
    name: "Family Member",
    relationship: "spouse",
    dateOfBirth: "1992-05-15",
    gender: "female",
    aadhaarNumber: "XXXX-XXXX-1234", // Masked for security
    isNominee: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  })

  console.log("✅ Sample data added successfully")
}

// Run the setup
setupFirestoreDatabase()
