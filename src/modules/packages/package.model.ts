
import mongoose, { Schema, Document, Types } from "mongoose";

// =====================================
// TYPES
// =====================================

export interface IPackage extends Document {
  agent: Types.ObjectId;

  title: string;
  slug: string;
  shortDescription: string;
  description: string;

  category: Types.ObjectId;

  packageType:
    | "DOMESTIC"
    | "INTERNATIONAL"
    | "HONEYMOON"
    | "FAMILY"
    | "ADVENTURE"
    | "RELIGIOUS"
    | "LUXURY"
    | "GROUP"
    | "CUSTOM";

  destination: {
    country: string;
    state?: string;
    city: string;
    places: string[];
  };

  duration: {
    days: number;
    nights: number;
  };

  thumbnail: string;
  gallery: string[];
  videoUrl?: string;

  travelMode:
    | "FLIGHT"
    | "TRAIN"
    | "BUS"
    | "CAR"
    | "MIXED"
    | "OTHER";

  pricing: {
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    originalPrice: number;
    currency: string;
    priceType: "PER_PERSON" | "PER_GROUP" | "PER_ROOM";
  };

  bookingType: "FIXED_DATE" | "FLEXIBLE_DATE";



  groupSize: {
    min: number;
    max: number;
  };

  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }[];

  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  thingsToCarry: string[];
  importantInformation: string[];

  accommodation: "BUDGET" | "STANDARD" | "DELUXE" | "LUXURY" | "MIXED";

  cancellationPolicy: string;

  faqs: {
    question: string;
    answer: string;
  }[];

  advancePayment: number;

  paymentSettings: {
    allowedMethods: ("FULL" | "PARTIAL")[];

    partialPayment: {
      enabled: boolean;
      advancePercentage: number;
      remainingPayment: "ON_TRAVEL_DAY";
      collectionMethod: "DIRECT_TO_AGENT";
    };
  };

  bookingEnabled: boolean;

  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED" | "INACTIVE";

  rejectionReason?: string;

  isFeatured: boolean;

  metaTitle?: string;
  metaDescription?: string;

  views: number;
  totalBookings: number;
  averageRating: number;
  totalReviews: number;

  createdAt: Date;
  updatedAt: Date;
}



const itinerarySchema = new Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    activities: {
      type: [String],
      default: [],
    },

    meals: {
      type: [String],
      default: [],
    },

    accommodation: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// =====================================
// DEPARTURE SCHEMA
// =====================================

// const departureSchema = new Schema(
//   {
//     startDate: {
//       type: Date,
//       required: true,
//     },

//     endDate: {
//       type: Date,
//       required: true,
//     },

//     availableSeats: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     bookedSeats: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     price: {
//       type: Number,
//       min: 0,
//     },

//     status: {
//       type: String,
//       enum: ["AVAILABLE", "FULL", "CANCELLED"],
//       default: "AVAILABLE",
//     },
//   },
//   { timestamps: true }
// );

// =====================================
// FAQ SCHEMA
// =====================================

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// =====================================
// PRICING SCHEMA
// =====================================

const pricingSchema = new Schema(
  {
    adultPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    childPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    infantPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    priceType: {
      type: String,
      enum: ["PER_PERSON", "PER_GROUP", "PER_ROOM"],
      default: "PER_PERSON",
    },
  },
  { _id: false }
);



// =====================================
// MAIN PACKAGE SCHEMA
// =====================================

const packageSchema = new Schema<IPackage>(
  {
    
    agent: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    // BASIC DETAILS
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: true,
    },

    // CATEGORY
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    packageType: {
      type: String,
      enum: [
        "DOMESTIC",
        "INTERNATIONAL",
        "HONEYMOON",
        "FAMILY",
        "ADVENTURE",
        "RELIGIOUS",
        "LUXURY",
        "GROUP",
        "OTHER",
      ],
      default: "DOMESTIC",
    },

   

    // DURATION
    duration: {
      days: {
        type: Number,
        required: true,
        min: 1,
      },

      nights: {
        type: Number,
        required: true,
        min: 0,
      },
    },

   

    // TRAVEL MODE
    travelMode: {
      type: String,
      enum: ["FLIGHT", "TRAIN", "BUS", "CAR", "MIXED", "OTHER"],
      default: "OTHER",
    },

    // PRICING
    pricing: {
      type: pricingSchema,
      required: true,
    },

    // BOOKING DATES
    bookingType: {
      type: String,
      enum: ["FIXED_DATE", "FLEXIBLE_DATE"],
      default: "FLEXIBLE_DATE",
    },

   
    // GROUP SIZE
    groupSize: {
      min: {
        type: Number,
        default: 1,
        min: 1,
      },

      max: {
        type: Number,
        default: 20,
        min: 1,
      },
    },

    // ITINERARY
    itinerary: {
      type: [itinerarySchema],
      default: [],
    },

    // INCLUSIONS AND EXCLUSIONS
    inclusions: {
      type: [String],
      default: [],
    },

    exclusions: {
      type: [String],
      default: [],
    },

    highlights: {
      type: [String],
      default: [],
    },

    thingsToCarry: {
      type: [String],
      default: [],
    },

    importantInformation: {
      type: [String],
      default: [],
    },

    // ACCOMMODATION
    accommodation: {
      type: String,
      enum: ["BUDGET", "STANDARD", "DELUXE", "LUXURY", "MIXED"],
      default: "STANDARD",
    },

    // CANCELLATION
    cancellationPolicy: {
      type: String,
      default: "",
    },

    // FAQ
    faqs: {
      type: [faqSchema],
      default: [],
    },

    // ADVANCE PAYMENT
    advancePayment: {
      type: Number,
      default: 0,
      min: 0,
    },


    // BOOKING ENABLE
    bookingEnabled: {
      type: Boolean,
      default: true,
    },

    // PACKAGE STATUS
    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED", "INACTIVE"],
      default: "DRAFT",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    // FEATURED
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // SEO
    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    // STATISTICS
    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
     // DESTINATION
    destination: {
      country: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      places: {
        type: [String],
        default: [],
      },
    },
     // IMAGES
    thumbnail: {
      type: String,
      required: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    videoUrl: {
      type: String,
      default: "",
    },


  },
  {
    timestamps: true,
  }
);

// =====================================
// INDEXES
// =====================================

packageSchema.index({
  title: "text",
  shortDescription: "text",
  "destination.city": "text",
  "destination.country": "text",
});

packageSchema.index({
  status: 1,
  category: 1,
  "destination.country": 1,
});

packageSchema.index({
  agent: 1,
  createdAt: -1,
});

// =====================================
// VALIDATIONS
// =====================================

packageSchema.pre("validate", function () {
  if (this.groupSize.min > this.groupSize.max) {
    this.invalidate(
      "groupSize",
      "Minimum group size cannot exceed maximum group size"
    );
  }



  if (this.paymentSettings?.partialPayment?.enabled) {
    if (!this.paymentSettings.allowedMethods.includes("PARTIAL")) {
      this.invalidate(
        "paymentSettings.allowedMethods",
        "PARTIAL must be allowed when partial payment is enabled"
      );
    }
  }

 
});


const Package =
  mongoose.models.Package ||
  mongoose.model<IPackage>("Package", packageSchema);

export default Package;
