import type { FastifyReply, FastifyRequest } from "fastify";
import Package from "./package.model.js";
import { DeleteImage, UploadImage } from "../../config/UploadImage.js";




const makeSlug = (title: string) => { return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
const generateUniqueSlug = async (title: string) => {
  const baseSlug = makeSlug(title) || "travel-package";

  let slug = `${baseSlug}-${Date.now()}`;
  let count = 1;

  while (await Package.exists({ slug })) {
    slug = `${baseSlug}-${Date.now()}-${count}`;
    count++;
  }

  return slug;
};



// export const createPackage = async(request:FastifyRequest,reply:FastifyReply) =>{
//     try {
//         const client = request.client as any;
//         const body = request.body as any;

//   if (!client?._id) {
//       return reply.code(401).send({
//         success: false,
//         message: "Unauthorized agent",
//       });
//     }
//       if (!mongoose.isValidObjectId(client._id)) {
//       return reply.code(401).send({
//         success: false,
//         message: "Invalid agent ID",
//       });
//     }
//    if (!isObject(body)) {
//       return reply.code(400).send({
//         success: false,
//         message: "Invalid request body",
//       });
//     }


//     const errors: string[] = [];

//   if (!isString(body.title)) {
//       errors.push("Package title is required");
//     }

//  if (
//       !isString(body.shortDescription) ||
//       body.shortDescription.trim().length > 300
//     ) {
//       errors.push("Short description is required (maximum 300 characters)");
//     }
//     if (!isString(body.description)) {
//       errors.push("Package description is required");
//     }

//  if (
//       !body.category ||
//       !mongoose.isValidObjectId(body.category)
//     ) {
//       errors.push("Valid package category is required");
//     }

//  if (
//       body.packageType &&
//       !allowedPackageTypes.includes(body.packageType)
//     ) {
//       errors.push("Invalid package type");
//     }
//   if (!isObject(body.destination)) {
//       errors.push("Destination details are required");
//     } 

//   else {
//       if (!isString(body.destination.country)) {
//         errors.push("Destination country is required");
//       }

//       if (!isString(body.destination.city)) {
//         errors.push("Destination city is required");
//       }

//       if (
//         body.destination.places !== undefined &&
//         !isStringArray(body.destination.places)
//       ) {
//         errors.push("Destination places must be an array of strings");
//       }
//     }

// if (!isObject(body.duration)) {
//       errors.push("Package duration is required");
//     } else {
//       if (!isNumber(body.duration.days) || body.duration.days < 1) {
//         errors.push("Duration days must be at least 1");
//       }

//       if (
//         !isNumber(body.duration.nights) ||
//         body.duration.nights < 0
//       ) {
//         errors.push("Duration nights must be 0 or greater");
//       }

//       if (
//         isNumber(body.duration.days) &&
//         isNumber(body.duration.nights) &&
//         body.duration.nights >= body.duration.days
//       ) {
//         errors.push("Nights must be less than days");
//       }
//     }

//     // ---------------------------------
//     // IMAGES
//     // ---------------------------------

//     if (!isString(body.thumbnail)) {
//       errors.push("Package thumbnail is required");
//     }

//     if (
//       body.gallery !== undefined &&
//       !isStringArray(body.gallery)
//     ) {
//       errors.push("Gallery must be an array of strings");
//     }

//     // ---------------------------------
//     // PRICING
//     // ---------------------------------

//     const pricing = body.pricing;

//     if (!isObject(pricing)) {
//       errors.push("Package pricing is required");
//     } else {
//       if (!isNumber(pricing.adultPrice) || pricing.adultPrice <= 0) {
//         errors.push("Adult price must be greater than 0");
//       }

//       for (const field of ["childPrice", "infantPrice", "originalPrice"]) {
//         if (
//           pricing[field] !== undefined &&
//           (!isNumber(pricing[field]) || pricing[field] < 0)
//         ) {
//           errors.push(`${field} must be a valid non-negative number`);
//         }
//       }

//       if (
//         isNumber(pricing.originalPrice) &&
//         isNumber(pricing.adultPrice) &&
//         pricing.originalPrice > 0 &&
//         pricing.originalPrice < pricing.adultPrice
//       ) {
//         errors.push("Original price cannot be less than adult selling price");
//       }

//       if (
//         pricing.priceType &&
//         !["PER_PERSON", "PER_GROUP", "PER_ROOM"].includes(
//           pricing.priceType
//         )
//       ) {
//         errors.push("Invalid pricing type");
//       }

//       if (
//         pricing.currency &&
//         !/^[A-Za-z]{3}$/.test(pricing.currency)
//       ) {
//         errors.push("Currency must be a valid 3-letter code");
//       }
//     }

//     // ---------------------------------
//     // BOOKING TYPE
//     // ---------------------------------

//     const bookingType = body.bookingType || "FLEXIBLE_DATE";

//     if (!["FIXED_DATE", "FLEXIBLE_DATE"].includes(bookingType)) {
//       errors.push("Invalid booking type");
//     }

//     // ---------------------------------
//     // DEPARTURE DATES
//     // ---------------------------------

//     if (
//       body.departureDates !== undefined &&
//       !Array.isArray(body.departureDates)
//     ) {
//       errors.push("Departure dates must be an array");
//     } else {
//       const departures = body.departureDates || [];

//       if (bookingType === "FIXED_DATE" && departures.length === 0) {
//         errors.push("At least one departure date is required");
//       }

//       departures.forEach((item: any, index: number) => {
//         if (!isObject(item)) {
//           errors.push(`Departure ${index + 1} is invalid`);
//           return;
//         }

//         if (!isValidDate(item.startDate)) {
//           errors.push(`Departure ${index + 1}: valid start date required`);
//         }

//         if (!isValidDate(item.endDate)) {
//           errors.push(`Departure ${index + 1}: valid end date required`);
//         }

//         if (
//           isValidDate(item.startDate) &&
//           isValidDate(item.endDate) &&
//           new Date(item.endDate) < new Date(item.startDate)
//         ) {
//           errors.push(`Departure ${index + 1}: end date cannot be before start date`);
//         }

//         if (
//           !isNumber(item.availableSeats) ||
//           item.availableSeats < 1
//         ) {
//           errors.push(`Departure ${index + 1}: available seats must be greater than 0`);
//         }

//         if (
//           item.price !== undefined &&
//           (!isNumber(item.price) || item.price < 0)
//         ) {
//           errors.push(`Departure ${index + 1}: invalid price`);
//         }
//       });
//     }

//     // ---------------------------------
//     // GROUP SIZE
//     // ---------------------------------

//     if (body.groupSize !== undefined) {
//       if (!isObject(body.groupSize)) {
//         errors.push("Invalid group size");
//       } else {
//         const min = body.groupSize.min ?? 1;
//         const max = body.groupSize.max ?? 20;

//         if (
//           !isNumber(min) ||
//           !Number.isInteger(min) ||
//           min < 1
//         ) {
//           errors.push("Minimum group size must be a positive integer");
//         }

//         if (
//           !isNumber(max) ||
//           !Number.isInteger(max) ||
//           max < 1
//         ) {
//           errors.push("Maximum group size must be a positive integer");
//         }

//         if (
//           isNumber(min) &&
//           isNumber(max) &&
//           min > max
//         ) {
//           errors.push("Minimum group size cannot exceed maximum group size");
//         }
//       }
//     }

//     // ---------------------------------
//     // ITINERARY
//     // ---------------------------------

//     if (
//       body.itinerary !== undefined &&
//       !Array.isArray(body.itinerary)
//     ) {
//       errors.push("Itinerary must be an array");
//     } else {
//       (body.itinerary || []).forEach((item: any, index: number) => {
//         if (!isObject(item)) {
//           errors.push(`Itinerary day ${index + 1} is invalid`);
//           return;
//         }

//         if (
//           !Number.isInteger(item.day) ||
//           item.day < 1
//         ) {
//           errors.push(`Itinerary day ${index + 1}: valid day number required`);
//         }

//         if (!isString(item.title)) {
//           errors.push(`Itinerary day ${index + 1}: title is required`);
//         }

//         if (!isString(item.description)) {
//           errors.push(`Itinerary day ${index + 1}: description is required`);
//         }

//         if (
//           item.activities !== undefined &&
//           !isStringArray(item.activities)
//         ) {
//           errors.push(`Itinerary day ${index + 1}: invalid activities`);
//         }

//         if (
//           item.meals !== undefined &&
//           !isStringArray(item.meals)
//         ) {
//           errors.push(`Itinerary day ${index + 1}: invalid meals`);
//         }
//       });
//     }

//     // ---------------------------------
//     // STRING ARRAYS
//     // ---------------------------------

//     const arrayFields = [
//       "inclusions",
//       "exclusions",
//       "highlights",
//       "thingsToCarry",
//       "importantInformation",
//     ];

//     for (const field of arrayFields) {
//       if (
//         body[field] !== undefined &&
//         !isStringArray(body[field])
//       ) {
//         errors.push(`${field} must be an array of strings`);
//       }
//     }

//     // ---------------------------------
//     // FAQ VALIDATION
//     // ---------------------------------

//     if (body.faqs !== undefined && !Array.isArray(body.faqs)) {
//       errors.push("FAQs must be an array");
//     } else {
//       (body.faqs || []).forEach((faq: any, index: number) => {
//         if (!isObject(faq) || !isString(faq.question) || !isString(faq.answer)) {
//           errors.push(`FAQ ${index + 1}: question and answer are required`);
//         }
//       });
//     }

//     // ---------------------------------
//     // PAYMENT SETTINGS
//     // ---------------------------------

//     const payment = body.paymentSettings || {};
//     const allowedMethods = payment.allowedMethods ?? ["FULL", "PARTIAL"];

//     if (
//       !Array.isArray(allowedMethods) ||
//       allowedMethods.length === 0 ||
//       allowedMethods.some(
//         (method: any) => !["FULL", "PARTIAL"].includes(method)
//       ) ||
//       new Set(allowedMethods).size !== allowedMethods.length
//     ) {
//       errors.push("Select valid payment methods");
//     }

//     const partialEnabled =
//       payment.partialPayment?.enabled ?? true;

//     if (
//       typeof partialEnabled !== "boolean"
//     ) {
//       errors.push("Partial payment enabled must be boolean");
//     }

//     if (
//       partialEnabled &&
//       !allowedMethods.includes("PARTIAL")
//     ) {
//       errors.push("PARTIAL payment must be allowed when partial payment is enabled");
//     }

//     if (
//       partialEnabled &&
//       payment.partialPayment?.advancePercentage !== undefined &&
//       payment.partialPayment.advancePercentage !== 20
//     ) {
//       errors.push("Partial payment advance must be exactly 20%");
//     }

//     // ---------------------------------
//     // ACCOMMODATION
//     // ---------------------------------

//     const accommodationTypes = [
//       "BUDGET",
//       "STANDARD",
//       "DELUXE",
//       "LUXURY",
//       "MIXED",
//     ];

//     if (
//       body.accommodation &&
//       !accommodationTypes.includes(body.accommodation)
//     ) {
//       errors.push("Invalid accommodation type");
//     }

//     // ---------------------------------
//     // TRAVEL MODE
//     // ---------------------------------

//     const travelModes = [
//       "FLIGHT",
//       "TRAIN",
//       "BUS",
//       "CAR",
//       "MIXED",
//       "OTHER",
//     ];

//     if (
//       body.travelMode &&
//       !travelModes.includes(body.travelMode)
//     ) {
//       errors.push("Invalid travel mode");
//     }

//     // ---------------------------------
//     // SEND VALIDATION ERRORS
//     // ---------------------------------

//     if (errors.length > 0) {
//       return reply.code(400).send({
//         success: false,
//         message: "Validation failed",
//         errors,
//       });
//     }

//     // ---------------------------------
//     // CREATE UNIQUE SLUG
//     // ---------------------------------

//     const slug = await generateUniqueSlug(body.title.trim());

//     // ---------------------------------
//     // CREATE PACKAGE
//     // Only allow approved fields
//     // ---------------------------------

//     const newPackage = await Package.create({
//       agent: client._id,

//       title: body.title.trim(),
//       slug,
//       shortDescription: body.shortDescription.trim(),
//       description: body.description,

//       category: body.category,

//       packageType: body.packageType || "DOMESTIC",

//       destination: {
//         country: body.destination.country.trim(),
//         state: body.destination.state?.trim() || "",
//         city: body.destination.city.trim(),
//         places: body.destination.places || [],
//       },

//       duration: body.duration,

//       thumbnail: body.thumbnail,
//       gallery: body.gallery || [],
//       videoUrl: body.videoUrl || "",

//       travelMode: body.travelMode || "OTHER",

//       pricing: {
//         adultPrice: body.pricing.adultPrice,
//         childPrice: body.pricing.childPrice ?? 0,
//         infantPrice: body.pricing.infantPrice ?? 0,
//         originalPrice: body.pricing.originalPrice ?? 0,
//         currency: body.pricing.currency || "INR",
//         priceType: body.pricing.priceType || "PER_PERSON",
//       },

//       bookingType,

//       departureDates: (body.departureDates || []).map((item: any) => ({
//         startDate: item.startDate,
//         endDate: item.endDate,
//         availableSeats: item.availableSeats,
//         bookedSeats: 0,
//         price: item.price,
//         status: "AVAILABLE",
//       })),

//       groupSize: {
//         min: body.groupSize?.min ?? 1,
//         max: body.groupSize?.max ?? 20,
//       },

//       itinerary: body.itinerary || [],

//       inclusions: body.inclusions || [],
//       exclusions: body.exclusions || [],
//       highlights: body.highlights || [],
//       thingsToCarry: body.thingsToCarry || [],
//       importantInformation: body.importantInformation || [],

//       accommodation: body.accommodation || "STANDARD",
//       cancellationPolicy: body.cancellationPolicy || "",
//       faqs: body.faqs || [],

//       // Platform-controlled payment rules
//       paymentSettings: {
//         allowedMethods,
//         partialPayment: {
//           enabled: partialEnabled,
//           advancePercentage: 20,
//           remainingPayment: "ON_TRAVEL_DAY",
//           collectionMethod: "DIRECT_TO_AGENT",
//         },
//       },

//       // Agent cannot control these fields
//       bookingEnabled: true,
//       status: "PENDING",
//       isFeatured: false,
//       views: 0,
//       totalBookings: 0,
//       averageRating: 0,
//       totalReviews: 0,

//       metaTitle: body.metaTitle || "",
//       metaDescription: body.metaDescription || "",
//     });

//     return reply.code(201).send({
//       success: true,
//       message: "Package created successfully. Waiting for admin approval.",
//       data: newPackage,
//     });

//   } catch (error: any) {
//     request.log.error(error);

//     // Duplicate slug
//     if (error.code === 11000) {
//       return reply.code(409).send({
//         success: false,
//         message: "Package slug already exists. Please try again.",
//       });
//     }

//     // Mongoose validation
//     if (error.name === "ValidationError") {
//       return reply.code(400).send({
//         success: false,
//         message: "Package validation failed",
//         errors: Object.values(error.errors).map(
//           (item: any) => item.message
//         ),
//       });
//     }

//     return reply.code(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };



export const createPackage = async(request:FastifyRequest,reply:FastifyReply)=>{
    const gallery: any[] = [];
    let fullthumnail = undefined
  try {
      const client = request.client as any;


   

    const fields: any ={
      agent:client._id
    }

 const parts = request.parts({
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 4,
        fields: 25,
      },
    });


  
     
      for await(const part of parts){
         
      if(part.type==="file"){
      if(part.fieldname=="thumbnail"){
   const thumbnail = await UploadImage({  file: part,
            allowedTypes: ["image/jpeg", "image/png", "image/webp"],
            folder: "packages"})
             fields.thumbnail = thumbnail.url;
             fullthumnail=thumbnail.url
      }
       else if (part.fieldname === "gallery") {

          const image = await UploadImage({
            file: part,
            allowedTypes: ["image/jpeg", "image/png", "image/webp"],
            folder: "packages/gallery",
          });

          gallery.push(image.url);
        }


      }
      else if(part.type=="field")
      {
  try {
      fields[part.fieldname] = JSON.parse(part.value as string);
    } catch {
      fields[part.fieldname] = part.value;
    }
      }
      

      }



if(!fields.title ){

throw new Error("Title is required")
}

if(!fields.thumbnail ){

throw new Error("thumbnail is required")
}

fields["slug"] = await generateUniqueSlug(fields?.title.trim());

fields["gallery"]= gallery

  const newPackage =  await Package.create(fields)

        return reply.code(201).send({
      success: true,
      mcessage: "Package created successfully. Waiting for admin approval.",
      newPackage
    });
  } catch (error) {
    console.log(error)
   
if (fullthumnail) {
  await DeleteImage(fullthumnail);
}

await Promise.all(
  gallery.map(item => DeleteImage(item))
);
      return reply.code(500).send({
      success: false,
      message: error,
    });
  }
}
