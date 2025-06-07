export const insuranceKnowledge = {
  products: {
    auto: {
      types: [
        {
          name: "Comprehensive Coverage",
          description: "Covers damage to your vehicle from accidents, theft, fire, and natural disasters",
          benefits: ["Full protection for your vehicle", "Third-party liability coverage", "Personal accident cover"],
          ideal_for: "New vehicles and high-value cars",
        },
        {
          name: "Third-Party Liability",
          description: "Mandatory insurance that covers damage to third-party vehicles or property",
          benefits: ["Legal compliance", "Affordable premiums", "Third-party injury coverage"],
          ideal_for: "Budget-conscious drivers and older vehicles",
        },
        {
          name: "Zero Depreciation",
          description: "Covers full cost of parts replacement without accounting for depreciation",
          benefits: ["No deduction for depreciation", "Higher claim amounts", "Peace of mind"],
          ideal_for: "New vehicles less than 3 years old",
        },
      ],
      eco_benefits: [
        "Discounts for electric and hybrid vehicles",
        "Lower premiums for low-emission vehicles",
        "Pay-as-you-drive options for reduced carbon footprint",
      ],
    },
    health: {
      types: [
        {
          name: "Individual Health Plan",
          description: "Coverage for medical expenses of a single person",
          benefits: ["Customized coverage", "No premium sharing", "Focused benefits"],
          ideal_for: "Single individuals or those with specific health needs",
        },
        {
          name: "Family Floater",
          description: "Single policy covering entire family with shared sum insured",
          benefits: ["Cost-effective", "Simplified management", "Flexible coverage"],
          ideal_for: "Families with young children",
        },
        {
          name: "Critical Illness",
          description: "Lump sum payment upon diagnosis of specified critical illnesses",
          benefits: ["Financial support during recovery", "No restriction on usage", "Tax benefits"],
          ideal_for: "Those with family history of serious illnesses",
        },
        {
          name: "Senior Citizen",
          description: "Specialized health coverage for individuals above 60 years",
          benefits: ["Age-appropriate coverage", "Pre-existing disease coverage", "Specialized care"],
          ideal_for: "Individuals above 60 years of age",
        },
      ],
      eco_benefits: [
        "Telemedicine consultations to reduce travel",
        "Digital policy documents and claims",
        "Wellness programs promoting sustainable lifestyle",
      ],
    },
    life: {
      types: [
        {
          name: "Term Insurance",
          description: "Pure protection plan providing death benefit for specified term",
          benefits: ["High coverage at low cost", "Financial security for dependents", "Tax benefits"],
          ideal_for: "Primary breadwinners with dependents",
        },
        {
          name: "Endowment",
          description: "Savings plus insurance with maturity benefits",
          benefits: ["Dual benefit of insurance and savings", "Disciplined savings", "Guaranteed returns"],
          ideal_for: "Conservative investors seeking security",
        },
        {
          name: "ULIP",
          description: "Investment plus insurance with market-linked returns",
          benefits: ["Market-linked growth potential", "Insurance coverage", "Tax benefits"],
          ideal_for: "Long-term investors comfortable with market risks",
        },
        {
          name: "Whole Life",
          description: "Lifetime coverage with savings component",
          benefits: ["Lifelong protection", "Estate planning", "Cash value accumulation"],
          ideal_for: "Estate planning and legacy creation",
        },
      ],
      eco_benefits: [
        "Paperless policy management",
        "Investments in sustainable and ethical funds",
        "Carbon offset programs with premium contributions",
      ],
    },
    home: {
      types: [
        {
          name: "Structure Insurance",
          description: "Covers physical structure of home against damages",
          benefits: ["Protection against natural disasters", "Reconstruction cost coverage", "Peace of mind"],
          ideal_for: "Homeowners in all areas",
        },
        {
          name: "Contents Insurance",
          description: "Covers belongings and valuables inside the home",
          benefits: ["Protection for valuables", "Theft coverage", "Replacement cost benefits"],
          ideal_for: "Homes with valuable contents",
        },
        {
          name: "All-Risk Coverage",
          description: "Comprehensive protection for both structure and contents",
          benefits: ["Complete protection", "Simplified claims", "Broader coverage"],
          ideal_for: "Primary residences with valuable contents",
        },
      ],
      eco_benefits: [
        "Discounts for green-certified homes",
        "Coverage for solar panels and renewable energy equipment",
        "Eco-friendly rebuilding options after claims",
      ],
    },
  },
  claims: {
    process: [
      "Notify insurer immediately after incident",
      "Fill and submit claim form with required documents",
      "Undergo verification process (may include inspection)",
      "Claim approval and settlement",
    ],
    documents: {
      auto: [
        "Filled claim form",
        "Copy of insurance policy",
        "Copy of driving license",
        "Copy of vehicle registration",
        "Police FIR (in case of theft or major accidents)",
        "Original repair bills and payment receipts",
      ],
      health: [
        "Filled claim form",
        "Copy of health card/policy",
        "Original hospital bills and payment receipts",
        "Discharge summary",
        "Prescription and pharmacy bills",
        "Investigation reports and doctor consultation papers",
      ],
      life: [
        "Filled claim form",
        "Original policy document",
        "Death certificate",
        "ID proof of nominee",
        "Bank account details of nominee",
        "Medical records (if applicable)",
      ],
      home: [
        "Filled claim form",
        "Copy of insurance policy",
        "List of damaged/lost items",
        "Original purchase receipts (if available)",
        "Police FIR (in case of theft)",
        "Photographs of damage",
      ],
    },
    timeline: {
      auto: "7-14 days for standard claims, 30 days for complex cases",
      health: "30 days for reimbursement claims, 1-4 hours for cashless approval",
      life: "7-30 days after document submission",
      home: "14-30 days depending on claim complexity",
    },
  },
  premiums: {
    factors: {
      auto: [
        "Vehicle make, model and age",
        "Cubic capacity and fuel type",
        "Geographical zone",
        "No-claim bonus status",
        "Add-on covers selected",
        "Driver's age and experience",
      ],
      health: [
        "Age of insured members",
        "Sum insured amount",
        "Pre-existing conditions",
        "City of residence",
        "Add-on covers selected",
        "Family size (for family floaters)",
      ],
      life: [
        "Age of insured",
        "Sum assured amount",
        "Policy term",
        "Occupation and lifestyle",
        "Medical history",
        "Smoking/tobacco usage",
      ],
      home: [
        "Property value and age",
        "Location and construction type",
        "Security measures installed",
        "Contents value",
        "Previous claims history",
        "Coverage options selected",
      ],
    },
    discounts: [
      "No-claim bonus (up to 50% for auto insurance)",
      "Multi-policy discount (5-10% for multiple policies)",
      "Online purchase discount (up to 15%)",
      "Long-term policy discount (up to 15% for 3-year policies)",
      "Eco-friendly vehicle discount (10-15% for electric/hybrid vehicles)",
      "Security device discount (5-10% for anti-theft devices)",
      "Green home discount (5-15% for eco-certified homes)",
    ],
  },
}
