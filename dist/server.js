

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_publish_key: process.env.STRIPE_PUBLISHABLE_KEY,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_price_id: process.env.STRIPE_PRICE_ID,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
};

// src/middlewares/globalErrorHandler.ts
import httpStatus from "http-status";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.9.0",
  "engineVersion": "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Booking {\n  id String @id @default(uuid())\n\n  customerId String\n  customer   User   @relation("CustomerBookings", fields: [customerId], references: [id])\n\n  technicianId String\n  technician   TechnicianProfile @relation("TechnicianBookings", fields: [technicianId], references: [id])\n\n  serviceId String\n  service   Service @relation(fields: [serviceId], references: [id])\n\n  scheduledAt DateTime\n  status      BookingStatus @default(PENDING)\n\n  payment Payment?\n  review  Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([serviceId])\n  @@map("bookings")\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum ActiveStatus {\n  BAN\n  UNBAN\n}\n\nenum BookingStatus {\n  PENDING\n  ACCEPTED\n  DECLINED\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n\nenum PaymentMethod {\n  STRIPE\n  SSLCOMMERZ\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  bookingId String?  @unique\n  booking   Booking? @relation(fields: [bookingId], references: [id])\n\n  stripeCustomerId     String  @unique\n  stripeSubscriptionId String? @unique\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  amount Float\n  method PaymentMethod\n\n  status PaymentStatus @default(PENDING)\n\n  transactionId String?   @unique\n  paidAt        DateTime?\n  createdAt     DateTime  @default(now())\n\n  @@map("payments")\n}\n\nmodel Profile {\n  id           String  @id @default(uuid())\n  profilePhoto String?\n  bio          String?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("profiles")\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id])\n\n  customerId String\n  customer   User   @relation("CustomerReviews", fields: [customerId], references: [id])\n\n  technicianId String\n  technician   TechnicianProfile @relation("TechnicianReviews", fields: [technicianId], references: [id])\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now())\n\n  @@index([technicianId])\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel ServiceCategory {\n  id          String    @id @default(uuid())\n  name        String    @unique @db.VarChar(255)\n  description String?\n  services    Service[]\n\n  createdAt DateTime @default(now())\n\n  @@map("service_categories")\n}\n\nmodel Service {\n  id           String            @id @default(uuid())\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  categoryId String\n  category   ServiceCategory @relation(fields: [categoryId], references: [id])\n\n  title       String  @db.VarChar(255)\n  description String?\n  price       Float\n\n  bookings Booking[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([technicianId])\n  @@index([categoryId])\n  @@map("services")\n}\n\nmodel TechnicianProfile {\n  id     String @id @default(uuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  bio        String?\n  skills     String[]\n  experience Int      @default(0)\n  hourlyRate Float\n  location   String?  @db.VarChar(255)\n  avgRating  Float    @default(0)\n\n  services     Service[]\n  availability Availability[]\n  bookings     Booking[]      @relation("TechnicianBookings")\n  reviews      Review[]       @relation("TechnicianReviews")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("technician_profiles")\n}\n\nmodel Availability {\n  id           String            @id @default(uuid())\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  dayOfWeek Int\n  startTime String @db.VarChar(5)\n  endTime   String @db.VarChar(5)\n\n  @@index([technicianId])\n  @@map("availabilities")\n}\n\nmodel User {\n  id           String       @id @default(uuid())\n  name         String       @db.VarChar(255)\n  email        String       @unique\n  password     String\n  activeStatus ActiveStatus @default(UNBAN)\n  role         Role         @default(CUSTOMER)\n  createdAt    DateTime     @default(now())\n  updatedAt    DateTime     @updatedAt\n  profile      Profile?\n\n  // Customer side relations\n  bookings Booking[] @relation("CustomerBookings")\n  reviews  Review[]  @relation("CustomerReviews")\n\n  // Technician side relation (1-1)\n  technicianProfile TechnicianProfile?\n  payments          Payment[]\n\n  @@map("users")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerBookings"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"TechnicianBookings"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"bookings"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripeSubscriptionId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"profiles"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerReviews"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"TechnicianReviews"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"ServiceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToServiceCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"service_categories"},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ServiceToTechnicianProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"ServiceCategory","relationName":"ServiceToServiceCategory"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"services"},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"location","kind":"scalar","type":"String"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToTechnicianProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTechnicianProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"TechnicianBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"TechnicianReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"technician_profiles"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"AvailabilityToTechnicianProfile"},{"name":"dayOfWeek","kind":"scalar","type":"Int"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"}],"dbName":"availabilities"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"activeStatus","kind":"enum","type":"ActiveStatus"},{"name":"role","kind":"enum","type":"Role"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"CustomerBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"CustomerReviews"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"}],"dbName":"users"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","user","profile","orderBy","cursor","bookings","booking","customer","technician","services","_count","category","availability","reviews","technicianProfile","payments","service","payment","review","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","data","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","create","update","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","having","_min","_max","Booking.groupBy","Booking.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","_avg","_sum","Payment.groupBy","Payment.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","ServiceCategory.findUnique","ServiceCategory.findUniqueOrThrow","ServiceCategory.findFirst","ServiceCategory.findFirstOrThrow","ServiceCategory.findMany","ServiceCategory.createOne","ServiceCategory.createMany","ServiceCategory.createManyAndReturn","ServiceCategory.updateOne","ServiceCategory.updateMany","ServiceCategory.updateManyAndReturn","ServiceCategory.upsertOne","ServiceCategory.deleteOne","ServiceCategory.deleteMany","ServiceCategory.groupBy","ServiceCategory.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","TechnicianProfile.groupBy","TechnicianProfile.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","ActiveStatus","activeStatus","Role","role","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","technicianId","dayOfWeek","startTime","endTime","userId","bio","skills","experience","hourlyRate","location","avgRating","has","hasEvery","hasSome","categoryId","title","description","price","bookingId","customerId","rating","comment","profilePhoto","stripeCustomerId","stripeSubscriptionId","amount","PaymentMethod","method","PaymentStatus","status","transactionId","paidAt","serviceId","scheduledAt","BookingStatus","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "-wRXkAEQBwAAowIAIAgAAMACACAQAADHAgAgEQAAyAIAIBIAAMkCACCrAQAAxQIAMKwBAAAFABCtAQAAxQIAMK4BAQAAAAG2AUAAjQIAIbcBQACNAgAhxgEBAIoCACHZAQEAigIAIeMBAADGAukBIuYBAQCKAgAh5wFAAI0CACEBAAAAAQAgCgEAAKMCACCrAQAAqwIAMKwBAAADABCtAQAAqwIAMK4BAQCKAgAhtgFAAI0CACG3AUAAjQIAIcoBAQCKAgAhywEBAKACACHcAQEAoAIAIQEAAAADACAQBwAAowIAIAgAAMACACAQAADHAgAgEQAAyAIAIBIAAMkCACCrAQAAxQIAMKwBAAAFABCtAQAAxQIAMK4BAQCKAgAhtgFAAI0CACG3AUAAjQIAIcYBAQCKAgAh2QEBAIoCACHjAQAAxgLpASLmAQEAigIAIecBQACNAgAhBQcAAIMEACAIAADyAwAgEAAArwQAIBEAALAEACASAACxBAAgAwAAAAUAIAMAAAYAMAQAAAEAIA0GAADEAgAgBwAAowIAIAgAAMACACCrAQAAwwIAMKwBAAAIABCtAQAAwwIAMK4BAQCKAgAhtgFAAI0CACHGAQEAigIAIdgBAQCKAgAh2QEBAIoCACHaAQIAoQIAIdsBAQCgAgAhBAYAAK0EACAHAACDBAAgCAAA8gMAINsBAAD7AwAgDQYAAMQCACAHAACjAgAgCAAAwAIAIKsBAADDAgAwrAEAAAgAEK0BAADDAgAwrgEBAAAAAbYBQACNAgAhxgEBAIoCACHYAQEAAAAB2QEBAIoCACHaAQIAoQIAIdsBAQCgAgAhAwAAAAgAIAMAAAkAMAQAAAoAIA4FAACPAgAgCAAAwAIAIAsAAMICACCrAQAAwQIAMKwBAAAMABCtAQAAwQIAMK4BAQCKAgAhtgFAAI0CACG3AUAAjQIAIcYBAQCKAgAh1AEBAIoCACHVAQEAigIAIdYBAQCgAgAh1wEIAKICACEEBQAA8AMAIAgAAPIDACALAACuBAAg1gEAAPsDACAOBQAAjwIAIAgAAMACACALAADCAgAgqwEAAMECADCsAQAADAAQrQEAAMECADCuAQEAAAABtgFAAI0CACG3AUAAjQIAIcYBAQCKAgAh1AEBAIoCACHVAQEAigIAIdYBAQCgAgAh1wEIAKICACEDAAAADAAgAwAADQAwBAAADgAgAwAAAAwAIAMAAA0AMAQAAA4AIAEAAAAMACADAAAABQAgAwAABgAwBAAAAQAgAQAAAAUAIAkIAADAAgAgqwEAAL8CADCsAQAAFAAQrQEAAL8CADCuAQEAigIAIcYBAQCKAgAhxwECAKECACHIAQEAigIAIckBAQCKAgAhAQgAAPIDACAJCAAAwAIAIKsBAAC_AgAwrAEAABQAEK0BAAC_AgAwrgEBAAAAAcYBAQCKAgAhxwECAKECACHIAQEAigIAIckBAQCKAgAhAwAAABQAIAMAABUAMAQAABYAIAMAAAAFACADAAAGADAEAAABACADAAAACAAgAwAACQAwBAAACgAgAQAAAAwAIAEAAAAUACABAAAABQAgAQAAAAgAIBIBAACjAgAgBQAAjwIAIAkAAKQCACAMAAClAgAgDQAAkAIAIKsBAACfAgAwrAEAAB4AEK0BAACfAgAwrgEBAIoCACG2AUAAjQIAIbcBQACNAgAhygEBAIoCACHLAQEAoAIAIcwBAACZAgAgzQECAKECACHOAQgAogIAIc8BAQCgAgAh0AEIAKICACEBAAAAHgAgEAEAAKMCACAGAAC-AgAgqwEAALoCADCsAQAAIAAQrQEAALoCADCuAQEAigIAIbYBQACNAgAhygEBAIoCACHYAQEAoAIAId0BAQCKAgAh3gEBAKACACHfAQgAogIAIeEBAAC7AuEBIuMBAAC8AuMBIuQBAQCgAgAh5QFAAL0CACEGAQAAgwQAIAYAAK0EACDYAQAA-wMAIN4BAAD7AwAg5AEAAPsDACDlAQAA-wMAIBABAACjAgAgBgAAvgIAIKsBAAC6AgAwrAEAACAAEK0BAAC6AgAwrgEBAAAAAbYBQACNAgAhygEBAAAAAdgBAQAAAAHdAQEAAAAB3gEBAAAAAd8BCACiAgAh4QEAALsC4QEi4wEAALwC4wEi5AEBAAAAAeUBQAC9AgAhAwAAACAAIAMAACEAMAQAACIAIAEAAAAFACABAAAABQAgAQAAAAgAIAEAAAAgACABAAAAIAAgAQAAAAgAIAEAAAABACADAAAABQAgAwAABgAwBAAAAQAgAwAAAAUAIAMAAAYAMAQAAAEAIAMAAAAFACADAAAGADAEAAABACANBwAAowMAIAgAAMoDACAQAACkAwAgEQAApQMAIBIAAKYDACCuAQEAAAABtgFAAAAAAbcBQAAAAAHGAQEAAAAB2QEBAAAAAeMBAAAA6QEC5gEBAAAAAecBQAAAAAEBGAAALgAgCK4BAQAAAAG2AUAAAAABtwFAAAAAAcYBAQAAAAHZAQEAAAAB4wEAAADpAQLmAQEAAAAB5wFAAAAAAQEYAAAwADABGAAAMAAwDQcAAJADACAIAADIAwAgEAAAkQMAIBEAAJIDACASAACTAwAgrgEBAM0CACG2AUAA0AIAIbcBQADQAgAhxgEBAM0CACHZAQEAzQIAIeMBAACOA-kBIuYBAQDNAgAh5wFAANACACECAAAAAQAgGAAAMwAgCK4BAQDNAgAhtgFAANACACG3AUAA0AIAIcYBAQDNAgAh2QEBAM0CACHjAQAAjgPpASLmAQEAzQIAIecBQADQAgAhAgAAAAUAIBgAADUAIAIAAAAFACAYAAA1ACADAAAAAQAgHwAALgAgIAAAMwAgAQAAAAEAIAEAAAAFACADCgAAqgQAICUAAKwEACAmAACrBAAgC6sBAAC2AgAwrAEAADwAEK0BAAC2AgAwrgEBAPwBACG2AUAA_wEAIbcBQAD_AQAhxgEBAPwBACHZAQEA_AEAIeMBAAC3AukBIuYBAQD8AQAh5wFAAP8BACEDAAAABQAgAwAAOwAwJAAAPAAgAwAAAAUAIAMAAAYAMAQAAAEAIAEAAAAiACABAAAAIgAgAwAAACAAIAMAACEAMAQAACIAIAMAAAAgACADAAAhADAEAAAiACADAAAAIAAgAwAAIQAwBAAAIgAgDQEAAKEDACAGAADoAgAgrgEBAAAAAbYBQAAAAAHKAQEAAAAB2AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEIAAAAAeEBAAAA4QEC4wEAAADjAQLkAQEAAAAB5QFAAAAAAQEYAABEACALrgEBAAAAAbYBQAAAAAHKAQEAAAAB2AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEIAAAAAeEBAAAA4QEC4wEAAADjAQLkAQEAAAAB5QFAAAAAAQEYAABGADABGAAARgAwAQAAAAUAIA0BAACgAwAgBgAA5gIAIK4BAQDNAgAhtgFAANACACHKAQEAzQIAIdgBAQDgAgAh3QEBAM0CACHeAQEA4AIAId8BCADhAgAh4QEAAOIC4QEi4wEAAOMC4wEi5AEBAOACACHlAUAA5AIAIQIAAAAiACAYAABKACALrgEBAM0CACG2AUAA0AIAIcoBAQDNAgAh2AEBAOACACHdAQEAzQIAId4BAQDgAgAh3wEIAOECACHhAQAA4gLhASLjAQAA4wLjASLkAQEA4AIAIeUBQADkAgAhAgAAACAAIBgAAEwAIAIAAAAgACAYAABMACABAAAABQAgAwAAACIAIB8AAEQAICAAAEoAIAEAAAAiACABAAAAIAAgCQoAAKUEACAlAACoBAAgJgAApwQAIDcAAKYEACA4AACpBAAg2AEAAPsDACDeAQAA-wMAIOQBAAD7AwAg5QEAAPsDACAOqwEAAKwCADCsAQAAVAAQrQEAAKwCADCuAQEA_AEAIbYBQAD_AQAhygEBAPwBACHYAQEAmAIAId0BAQD8AQAh3gEBAJgCACHfAQgAmgIAIeEBAACtAuEBIuMBAACuAuMBIuQBAQCYAgAh5QFAAK8CACEDAAAAIAAgAwAAUwAwJAAAVAAgAwAAACAAIAMAACEAMAQAACIAIAoBAACjAgAgqwEAAKsCADCsAQAAAwAQrQEAAKsCADCuAQEAAAABtgFAAI0CACG3AUAAjQIAIcoBAQAAAAHLAQEAoAIAIdwBAQCgAgAhAQAAAFcAIAEAAABXACADAQAAgwQAIMsBAAD7AwAg3AEAAPsDACADAAAAAwAgAwAAWgAwBAAAVwAgAwAAAAMAIAMAAFoAMAQAAFcAIAMAAAADACADAABaADAEAABXACAHAQAApAQAIK4BAQAAAAG2AUAAAAABtwFAAAAAAcoBAQAAAAHLAQEAAAAB3AEBAAAAAQEYAABeACAGrgEBAAAAAbYBQAAAAAG3AUAAAAABygEBAAAAAcsBAQAAAAHcAQEAAAABARgAAGAAMAEYAABgADAHAQAAowQAIK4BAQDNAgAhtgFAANACACG3AUAA0AIAIcoBAQDNAgAhywEBAOACACHcAQEA4AIAIQIAAABXACAYAABjACAGrgEBAM0CACG2AUAA0AIAIbcBQADQAgAhygEBAM0CACHLAQEA4AIAIdwBAQDgAgAhAgAAAAMAIBgAAGUAIAIAAAADACAYAABlACADAAAAVwAgHwAAXgAgIAAAYwAgAQAAAFcAIAEAAAADACAFCgAAoAQAICUAAKIEACAmAAChBAAgywEAAPsDACDcAQAA-wMAIAmrAQAAqgIAMKwBAABsABCtAQAAqgIAMK4BAQD8AQAhtgFAAP8BACG3AUAA_wEAIcoBAQD8AQAhywEBAJgCACHcAQEAmAIAIQMAAAADACADAABrADAkAABsACADAAAAAwAgAwAAWgAwBAAAVwAgAQAAAAoAIAEAAAAKACADAAAACAAgAwAACQAwBAAACgAgAwAAAAgAIAMAAAkAMAQAAAoAIAMAAAAIACADAAAJADAEAAAKACAKBgAAggMAIAcAAIMDACAIAACaAwAgrgEBAAAAAbYBQAAAAAHGAQEAAAAB2AEBAAAAAdkBAQAAAAHaAQIAAAAB2wEBAAAAAQEYAAB0ACAHrgEBAAAAAbYBQAAAAAHGAQEAAAAB2AEBAAAAAdkBAQAAAAHaAQIAAAAB2wEBAAAAAQEYAAB2ADABGAAAdgAwCgYAAP8CACAHAACAAwAgCAAAmQMAIK4BAQDNAgAhtgFAANACACHGAQEAzQIAIdgBAQDNAgAh2QEBAM0CACHaAQIA7wIAIdsBAQDgAgAhAgAAAAoAIBgAAHkAIAeuAQEAzQIAIbYBQADQAgAhxgEBAM0CACHYAQEAzQIAIdkBAQDNAgAh2gECAO8CACHbAQEA4AIAIQIAAAAIACAYAAB7ACACAAAACAAgGAAAewAgAwAAAAoAIB8AAHQAICAAAHkAIAEAAAAKACABAAAACAAgBgoAAJsEACAlAACeBAAgJgAAnQQAIDcAAJwEACA4AACfBAAg2wEAAPsDACAKqwEAAKkCADCsAQAAggEAEK0BAACpAgAwrgEBAPwBACG2AUAA_wEAIcYBAQD8AQAh2AEBAPwBACHZAQEA_AEAIdoBAgCUAgAh2wEBAJgCACEDAAAACAAgAwAAgQEAMCQAAIIBACADAAAACAAgAwAACQAwBAAACgAgCAkAAKQCACCrAQAAqAIAMKwBAACIAQAQrQEAAKgCADCuAQEAAAABrwEBAAAAAbYBQACNAgAh1gEBAKACACEBAAAAhQEAIAEAAACFAQAgCAkAAKQCACCrAQAAqAIAMKwBAACIAQAQrQEAAKgCADCuAQEAigIAIa8BAQCKAgAhtgFAAI0CACHWAQEAoAIAIQIJAACEBAAg1gEAAPsDACADAAAAiAEAIAMAAIkBADAEAACFAQAgAwAAAIgBACADAACJAQAwBAAAhQEAIAMAAACIAQAgAwAAiQEAMAQAAIUBACAFCQAAmgQAIK4BAQAAAAGvAQEAAAABtgFAAAAAAdYBAQAAAAEBGAAAjQEAIASuAQEAAAABrwEBAAAAAbYBQAAAAAHWAQEAAAABARgAAI8BADABGAAAjwEAMAUJAACQBAAgrgEBAM0CACGvAQEAzQIAIbYBQADQAgAh1gEBAOACACECAAAAhQEAIBgAAJIBACAErgEBAM0CACGvAQEAzQIAIbYBQADQAgAh1gEBAOACACECAAAAiAEAIBgAAJQBACACAAAAiAEAIBgAAJQBACADAAAAhQEAIB8AAI0BACAgAACSAQAgAQAAAIUBACABAAAAiAEAIAQKAACNBAAgJQAAjwQAICYAAI4EACDWAQAA-wMAIAerAQAApwIAMKwBAACbAQAQrQEAAKcCADCuAQEA_AEAIa8BAQD8AQAhtgFAAP8BACHWAQEAmAIAIQMAAACIAQAgAwAAmgEAMCQAAJsBACADAAAAiAEAIAMAAIkBADAEAACFAQAgAQAAAA4AIAEAAAAOACADAAAADAAgAwAADQAwBAAADgAgAwAAAAwAIAMAAA0AMAQAAA4AIAMAAAAMACADAAANADAEAAAOACALBQAAzQMAIAgAAIwEACALAADMAwAgrgEBAAAAAbYBQAAAAAG3AUAAAAABxgEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAdcBCAAAAAEBGAAAowEAIAiuAQEAAAABtgFAAAAAAbcBQAAAAAHGAQEAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAAB1wEIAAAAAQEYAAClAQAwARgAAKUBADALBQAAvwMAIAgAAIsEACALAAC-AwAgrgEBAM0CACG2AUAA0AIAIbcBQADQAgAhxgEBAM0CACHUAQEAzQIAIdUBAQDNAgAh1gEBAOACACHXAQgA4QIAIQIAAAAOACAYAACoAQAgCK4BAQDNAgAhtgFAANACACG3AUAA0AIAIcYBAQDNAgAh1AEBAM0CACHVAQEAzQIAIdYBAQDgAgAh1wEIAOECACECAAAADAAgGAAAqgEAIAIAAAAMACAYAACqAQAgAwAAAA4AIB8AAKMBACAgAACoAQAgAQAAAA4AIAEAAAAMACAGCgAAhgQAICUAAIkEACAmAACIBAAgNwAAhwQAIDgAAIoEACDWAQAA-wMAIAurAQAApgIAMKwBAACxAQAQrQEAAKYCADCuAQEA_AEAIbYBQAD_AQAhtwFAAP8BACHGAQEA_AEAIdQBAQD8AQAh1QEBAPwBACHWAQEAmAIAIdcBCACaAgAhAwAAAAwAIAMAALABADAkAACxAQAgAwAAAAwAIAMAAA0AMAQAAA4AIBIBAACjAgAgBQAAjwIAIAkAAKQCACAMAAClAgAgDQAAkAIAIKsBAACfAgAwrAEAAB4AEK0BAACfAgAwrgEBAAAAAbYBQACNAgAhtwFAAI0CACHKAQEAAAABywEBAKACACHMAQAAmQIAIM0BAgChAgAhzgEIAKICACHPAQEAoAIAIdABCACiAgAhAQAAALQBACABAAAAtAEAIAcBAACDBAAgBQAA8AMAIAkAAIQEACAMAACFBAAgDQAA8QMAIMsBAAD7AwAgzwEAAPsDACADAAAAHgAgAwAAtwEAMAQAALQBACADAAAAHgAgAwAAtwEAMAQAALQBACADAAAAHgAgAwAAtwEAMAQAALQBACAPAQAAggQAIAUAANEDACAJAADPAwAgDAAA0AMAIA0AANIDACCuAQEAAAABtgFAAAAAAbcBQAAAAAHKAQEAAAABywEBAAAAAcwBAADOAwAgzQECAAAAAc4BCAAAAAHPAQEAAAAB0AEIAAAAAQEYAAC7AQAgCq4BAQAAAAG2AUAAAAABtwFAAAAAAcoBAQAAAAHLAQEAAAABzAEAAM4DACDNAQIAAAABzgEIAAAAAc8BAQAAAAHQAQgAAAABARgAAL0BADABGAAAvQEAMA8BAACBBAAgBQAA8gIAIAkAAPACACAMAADxAgAgDQAA8wIAIK4BAQDNAgAhtgFAANACACG3AUAA0AIAIcoBAQDNAgAhywEBAOACACHMAQAA7gIAIM0BAgDvAgAhzgEIAOECACHPAQEA4AIAIdABCADhAgAhAgAAALQBACAYAADAAQAgCq4BAQDNAgAhtgFAANACACG3AUAA0AIAIcoBAQDNAgAhywEBAOACACHMAQAA7gIAIM0BAgDvAgAhzgEIAOECACHPAQEA4AIAIdABCADhAgAhAgAAAB4AIBgAAMIBACACAAAAHgAgGAAAwgEAIAMAAAC0AQAgHwAAuwEAICAAAMABACABAAAAtAEAIAEAAAAeACAHCgAA_AMAICUAAP8DACAmAAD-AwAgNwAA_QMAIDgAAIAEACDLAQAA-wMAIM8BAAD7AwAgDasBAACXAgAwrAEAAMkBABCtAQAAlwIAMK4BAQD8AQAhtgFAAP8BACG3AUAA_wEAIcoBAQD8AQAhywEBAJgCACHMAQAAmQIAIM0BAgCUAgAhzgEIAJoCACHPAQEAmAIAIdABCACaAgAhAwAAAB4AIAMAAMgBADAkAADJAQAgAwAAAB4AIAMAALcBADAEAAC0AQAgAQAAABYAIAEAAAAWACADAAAAFAAgAwAAFQAwBAAAFgAgAwAAABQAIAMAABUAMAQAABYAIAMAAAAUACADAAAVADAEAAAWACAGCAAA-gMAIK4BAQAAAAHGAQEAAAABxwECAAAAAcgBAQAAAAHJAQEAAAABARgAANEBACAFrgEBAAAAAcYBAQAAAAHHAQIAAAAByAEBAAAAAckBAQAAAAEBGAAA0wEAMAEYAADTAQAwBggAAPkDACCuAQEAzQIAIcYBAQDNAgAhxwECAO8CACHIAQEAzQIAIckBAQDNAgAhAgAAABYAIBgAANYBACAFrgEBAM0CACHGAQEAzQIAIccBAgDvAgAhyAEBAM0CACHJAQEAzQIAIQIAAAAUACAYAADYAQAgAgAAABQAIBgAANgBACADAAAAFgAgHwAA0QEAICAAANYBACABAAAAFgAgAQAAABQAIAUKAAD0AwAgJQAA9wMAICYAAPYDACA3AAD1AwAgOAAA-AMAIAirAQAAkwIAMKwBAADfAQAQrQEAAJMCADCuAQEA_AEAIcYBAQD8AQAhxwECAJQCACHIAQEA_AEAIckBAQD8AQAhAwAAABQAIAMAAN4BADAkAADfAQAgAwAAABQAIAMAABUAMAQAABYAIBACAACOAgAgBQAAjwIAIA0AAJACACAOAACRAgAgDwAAkgIAIKsBAACJAgAwrAEAAOUBABCtAQAAiQIAMK4BAQAAAAGvAQEAigIAIbABAQAAAAGxAQEAigIAIbMBAACLArMBIrUBAACMArUBIrYBQACNAgAhtwFAAI0CACEBAAAA4gEAIAEAAADiAQAgEAIAAI4CACAFAACPAgAgDQAAkAIAIA4AAJECACAPAACSAgAgqwEAAIkCADCsAQAA5QEAEK0BAACJAgAwrgEBAIoCACGvAQEAigIAIbABAQCKAgAhsQEBAIoCACGzAQAAiwKzASK1AQAAjAK1ASK2AUAAjQIAIbcBQACNAgAhBQIAAO8DACAFAADwAwAgDQAA8QMAIA4AAPIDACAPAADzAwAgAwAAAOUBACADAADmAQAwBAAA4gEAIAMAAADlAQAgAwAA5gEAMAQAAOIBACADAAAA5QEAIAMAAOYBADAEAADiAQAgDQIAAOoDACAFAADrAwAgDQAA7AMAIA4AAO0DACAPAADuAwAgrgEBAAAAAa8BAQAAAAGwAQEAAAABsQEBAAAAAbMBAAAAswECtQEAAAC1AQK2AUAAAAABtwFAAAAAAQEYAADqAQAgCK4BAQAAAAGvAQEAAAABsAEBAAAAAbEBAQAAAAGzAQAAALMBArUBAAAAtQECtgFAAAAAAbcBQAAAAAEBGAAA7AEAMAEYAADsAQAwDQIAANECACAFAADSAgAgDQAA0wIAIA4AANQCACAPAADVAgAgrgEBAM0CACGvAQEAzQIAIbABAQDNAgAhsQEBAM0CACGzAQAAzgKzASK1AQAAzwK1ASK2AUAA0AIAIbcBQADQAgAhAgAAAOIBACAYAADvAQAgCK4BAQDNAgAhrwEBAM0CACGwAQEAzQIAIbEBAQDNAgAhswEAAM4CswEitQEAAM8CtQEitgFAANACACG3AUAA0AIAIQIAAADlAQAgGAAA8QEAIAIAAADlAQAgGAAA8QEAIAMAAADiAQAgHwAA6gEAICAAAO8BACABAAAA4gEAIAEAAADlAQAgAwoAAMoCACAlAADMAgAgJgAAywIAIAurAQAA-wEAMKwBAAD4AQAQrQEAAPsBADCuAQEA_AEAIa8BAQD8AQAhsAEBAPwBACGxAQEA_AEAIbMBAAD9AbMBIrUBAAD-AbUBIrYBQAD_AQAhtwFAAP8BACEDAAAA5QEAIAMAAPcBADAkAAD4AQAgAwAAAOUBACADAADmAQAwBAAA4gEAIAurAQAA-wEAMKwBAAD4AQAQrQEAAPsBADCuAQEA_AEAIa8BAQD8AQAhsAEBAPwBACGxAQEA_AEAIbMBAAD9AbMBIrUBAAD-AbUBIrYBQAD_AQAhtwFAAP8BACEOCgAAgQIAICUAAIgCACAmAACIAgAguAEBAAAAAbkBAQAAAAS6AQEAAAAEuwEBAAAAAbwBAQAAAAG9AQEAAAABvgEBAAAAAb8BAQCHAgAhwAEBAAAAAcEBAQAAAAHCAQEAAAABBwoAAIECACAlAACGAgAgJgAAhgIAILgBAAAAswECuQEAAACzAQi6AQAAALMBCL8BAACFArMBIgcKAACBAgAgJQAAhAIAICYAAIQCACC4AQAAALUBArkBAAAAtQEIugEAAAC1AQi_AQAAgwK1ASILCgAAgQIAICUAAIICACAmAACCAgAguAFAAAAAAbkBQAAAAAS6AUAAAAAEuwFAAAAAAbwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQACAAgAhCwoAAIECACAlAACCAgAgJgAAggIAILgBQAAAAAG5AUAAAAAEugFAAAAABLsBQAAAAAG8AUAAAAABvQFAAAAAAb4BQAAAAAG_AUAAgAIAIQi4AQIAAAABuQECAAAABLoBAgAAAAS7AQIAAAABvAECAAAAAb0BAgAAAAG-AQIAAAABvwECAIECACEIuAFAAAAAAbkBQAAAAAS6AUAAAAAEuwFAAAAAAbwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQACCAgAhBwoAAIECACAlAACEAgAgJgAAhAIAILgBAAAAtQECuQEAAAC1AQi6AQAAALUBCL8BAACDArUBIgS4AQAAALUBArkBAAAAtQEIugEAAAC1AQi_AQAAhAK1ASIHCgAAgQIAICUAAIYCACAmAACGAgAguAEAAACzAQK5AQAAALMBCLoBAAAAswEIvwEAAIUCswEiBLgBAAAAswECuQEAAACzAQi6AQAAALMBCL8BAACGArMBIg4KAACBAgAgJQAAiAIAICYAAIgCACC4AQEAAAABuQEBAAAABLoBAQAAAAS7AQEAAAABvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAIcCACHAAQEAAAABwQEBAAAAAcIBAQAAAAELuAEBAAAAAbkBAQAAAAS6AQEAAAAEuwEBAAAAAbwBAQAAAAG9AQEAAAABvgEBAAAAAb8BAQCIAgAhwAEBAAAAAcEBAQAAAAHCAQEAAAABEAIAAI4CACAFAACPAgAgDQAAkAIAIA4AAJECACAPAACSAgAgqwEAAIkCADCsAQAA5QEAEK0BAACJAgAwrgEBAIoCACGvAQEAigIAIbABAQCKAgAhsQEBAIoCACGzAQAAiwKzASK1AQAAjAK1ASK2AUAAjQIAIbcBQACNAgAhC7gBAQAAAAG5AQEAAAAEugEBAAAABLsBAQAAAAG8AQEAAAABvQEBAAAAAb4BAQAAAAG_AQEAiAIAIcABAQAAAAHBAQEAAAABwgEBAAAAAQS4AQAAALMBArkBAAAAswEIugEAAACzAQi_AQAAhgKzASIEuAEAAAC1AQK5AQAAALUBCLoBAAAAtQEIvwEAAIQCtQEiCLgBQAAAAAG5AUAAAAAEugFAAAAABLsBQAAAAAG8AUAAAAABvQFAAAAAAb4BQAAAAAG_AUAAggIAIQwBAACjAgAgqwEAAKsCADCsAQAAAwAQrQEAAKsCADCuAQEAigIAIbYBQACNAgAhtwFAAI0CACHKAQEAigIAIcsBAQCgAgAh3AEBAKACACHpAQAAAwAg6gEAAAMAIAPDAQAABQAgxAEAAAUAIMUBAAAFACADwwEAAAgAIMQBAAAIACDFAQAACAAgFAEAAKMCACAFAACPAgAgCQAApAIAIAwAAKUCACANAACQAgAgqwEAAJ8CADCsAQAAHgAQrQEAAJ8CADCuAQEAigIAIbYBQACNAgAhtwFAAI0CACHKAQEAigIAIcsBAQCgAgAhzAEAAJkCACDNAQIAoQIAIc4BCACiAgAhzwEBAKACACHQAQgAogIAIekBAAAeACDqAQAAHgAgA8MBAAAgACDEAQAAIAAgxQEAACAAIAirAQAAkwIAMKwBAADfAQAQrQEAAJMCADCuAQEA_AEAIcYBAQD8AQAhxwECAJQCACHIAQEA_AEAIckBAQD8AQAhDQoAAIECACAlAACBAgAgJgAAgQIAIDcAAJYCACA4AACBAgAguAECAAAAAbkBAgAAAAS6AQIAAAAEuwECAAAAAbwBAgAAAAG9AQIAAAABvgECAAAAAb8BAgCVAgAhDQoAAIECACAlAACBAgAgJgAAgQIAIDcAAJYCACA4AACBAgAguAECAAAAAbkBAgAAAAS6AQIAAAAEuwECAAAAAbwBAgAAAAG9AQIAAAABvgECAAAAAb8BAgCVAgAhCLgBCAAAAAG5AQgAAAAEugEIAAAABLsBCAAAAAG8AQgAAAABvQEIAAAAAb4BCAAAAAG_AQgAlgIAIQ2rAQAAlwIAMKwBAADJAQAQrQEAAJcCADCuAQEA_AEAIbYBQAD_AQAhtwFAAP8BACHKAQEA_AEAIcsBAQCYAgAhzAEAAJkCACDNAQIAlAIAIc4BCACaAgAhzwEBAJgCACHQAQgAmgIAIQ4KAACdAgAgJQAAngIAICYAAJ4CACC4AQEAAAABuQEBAAAABboBAQAAAAW7AQEAAAABvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAJwCACHAAQEAAAABwQEBAAAAAcIBAQAAAAEEuAEBAAAABdEBAQAAAAHSAQEAAAAE0wEBAAAABA0KAACBAgAgJQAAlgIAICYAAJYCACA3AACWAgAgOAAAlgIAILgBCAAAAAG5AQgAAAAEugEIAAAABLsBCAAAAAG8AQgAAAABvQEIAAAAAb4BCAAAAAG_AQgAmwIAIQ0KAACBAgAgJQAAlgIAICYAAJYCACA3AACWAgAgOAAAlgIAILgBCAAAAAG5AQgAAAAEugEIAAAABLsBCAAAAAG8AQgAAAABvQEIAAAAAb4BCAAAAAG_AQgAmwIAIQ4KAACdAgAgJQAAngIAICYAAJ4CACC4AQEAAAABuQEBAAAABboBAQAAAAW7AQEAAAABvAEBAAAAAb0BAQAAAAG-AQEAAAABvwEBAJwCACHAAQEAAAABwQEBAAAAAcIBAQAAAAEIuAECAAAAAbkBAgAAAAW6AQIAAAAFuwECAAAAAbwBAgAAAAG9AQIAAAABvgECAAAAAb8BAgCdAgAhC7gBAQAAAAG5AQEAAAAFugEBAAAABbsBAQAAAAG8AQEAAAABvQEBAAAAAb4BAQAAAAG_AQEAngIAIcABAQAAAAHBAQEAAAABwgEBAAAAARIBAACjAgAgBQAAjwIAIAkAAKQCACAMAAClAgAgDQAAkAIAIKsBAACfAgAwrAEAAB4AEK0BAACfAgAwrgEBAIoCACG2AUAAjQIAIbcBQACNAgAhygEBAIoCACHLAQEAoAIAIcwBAACZAgAgzQECAKECACHOAQgAogIAIc8BAQCgAgAh0AEIAKICACELuAEBAAAAAbkBAQAAAAW6AQEAAAAFuwEBAAAAAbwBAQAAAAG9AQEAAAABvgEBAAAAAb8BAQCeAgAhwAEBAAAAAcEBAQAAAAHCAQEAAAABCLgBAgAAAAG5AQIAAAAEugECAAAABLsBAgAAAAG8AQIAAAABvQECAAAAAb4BAgAAAAG_AQIAgQIAIQi4AQgAAAABuQEIAAAABLoBCAAAAAS7AQgAAAABvAEIAAAAAb0BCAAAAAG-AQgAAAABvwEIAJYCACESAgAAjgIAIAUAAI8CACANAACQAgAgDgAAkQIAIA8AAJICACCrAQAAiQIAMKwBAADlAQAQrQEAAIkCADCuAQEAigIAIa8BAQCKAgAhsAEBAIoCACGxAQEAigIAIbMBAACLArMBIrUBAACMArUBIrYBQACNAgAhtwFAAI0CACHpAQAA5QEAIOoBAADlAQAgA8MBAAAMACDEAQAADAAgxQEAAAwAIAPDAQAAFAAgxAEAABQAIMUBAAAUACALqwEAAKYCADCsAQAAsQEAEK0BAACmAgAwrgEBAPwBACG2AUAA_wEAIbcBQAD_AQAhxgEBAPwBACHUAQEA_AEAIdUBAQD8AQAh1gEBAJgCACHXAQgAmgIAIQerAQAApwIAMKwBAACbAQAQrQEAAKcCADCuAQEA_AEAIa8BAQD8AQAhtgFAAP8BACHWAQEAmAIAIQgJAACkAgAgqwEAAKgCADCsAQAAiAEAEK0BAACoAgAwrgEBAIoCACGvAQEAigIAIbYBQACNAgAh1gEBAKACACEKqwEAAKkCADCsAQAAggEAEK0BAACpAgAwrgEBAPwBACG2AUAA_wEAIcYBAQD8AQAh2AEBAPwBACHZAQEA_AEAIdoBAgCUAgAh2wEBAJgCACEJqwEAAKoCADCsAQAAbAAQrQEAAKoCADCuAQEA_AEAIbYBQAD_AQAhtwFAAP8BACHKAQEA_AEAIcsBAQCYAgAh3AEBAJgCACEKAQAAowIAIKsBAACrAgAwrAEAAAMAEK0BAACrAgAwrgEBAIoCACG2AUAAjQIAIbcBQACNAgAhygEBAIoCACHLAQEAoAIAIdwBAQCgAgAhDqsBAACsAgAwrAEAAFQAEK0BAACsAgAwrgEBAPwBACG2AUAA_wEAIcoBAQD8AQAh2AEBAJgCACHdAQEA_AEAId4BAQCYAgAh3wEIAJoCACHhAQAArQLhASLjAQAArgLjASLkAQEAmAIAIeUBQACvAgAhBwoAAIECACAlAAC1AgAgJgAAtQIAILgBAAAA4QECuQEAAADhAQi6AQAAAOEBCL8BAAC0AuEBIgcKAACBAgAgJQAAswIAICYAALMCACC4AQAAAOMBArkBAAAA4wEIugEAAADjAQi_AQAAsgLjASILCgAAnQIAICUAALECACAmAACxAgAguAFAAAAAAbkBQAAAAAW6AUAAAAAFuwFAAAAAAbwBQAAAAAG9AUAAAAABvgFAAAAAAb8BQACwAgAhCwoAAJ0CACAlAACxAgAgJgAAsQIAILgBQAAAAAG5AUAAAAAFugFAAAAABbsBQAAAAAG8AUAAAAABvQFAAAAAAb4BQAAAAAG_AUAAsAIAIQi4AUAAAAABuQFAAAAABboBQAAAAAW7AUAAAAABvAFAAAAAAb0BQAAAAAG-AUAAAAABvwFAALECACEHCgAAgQIAICUAALMCACAmAACzAgAguAEAAADjAQK5AQAAAOMBCLoBAAAA4wEIvwEAALIC4wEiBLgBAAAA4wECuQEAAADjAQi6AQAAAOMBCL8BAACzAuMBIgcKAACBAgAgJQAAtQIAICYAALUCACC4AQAAAOEBArkBAAAA4QEIugEAAADhAQi_AQAAtALhASIEuAEAAADhAQK5AQAAAOEBCLoBAAAA4QEIvwEAALUC4QEiC6sBAAC2AgAwrAEAADwAEK0BAAC2AgAwrgEBAPwBACG2AUAA_wEAIbcBQAD_AQAhxgEBAPwBACHZAQEA_AEAIeMBAAC3AukBIuYBAQD8AQAh5wFAAP8BACEHCgAAgQIAICUAALkCACAmAAC5AgAguAEAAADpAQK5AQAAAOkBCLoBAAAA6QEIvwEAALgC6QEiBwoAAIECACAlAAC5AgAgJgAAuQIAILgBAAAA6QECuQEAAADpAQi6AQAAAOkBCL8BAAC4AukBIgS4AQAAAOkBArkBAAAA6QEIugEAAADpAQi_AQAAuQLpASIQAQAAowIAIAYAAL4CACCrAQAAugIAMKwBAAAgABCtAQAAugIAMK4BAQCKAgAhtgFAAI0CACHKAQEAigIAIdgBAQCgAgAh3QEBAIoCACHeAQEAoAIAId8BCACiAgAh4QEAALsC4QEi4wEAALwC4wEi5AEBAKACACHlAUAAvQIAIQS4AQAAAOEBArkBAAAA4QEIugEAAADhAQi_AQAAtQLhASIEuAEAAADjAQK5AQAAAOMBCLoBAAAA4wEIvwEAALMC4wEiCLgBQAAAAAG5AUAAAAAFugFAAAAABbsBQAAAAAG8AUAAAAABvQFAAAAAAb4BQAAAAAG_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-AIAMO8BAAD4AgAw8AEAAPgCADDxAQAA-AIAMPIBAADYAwAw8wEAAPsCADAHHwAA6QIAICAAAOwCACDrAQAA6gIAIOwBAADrAgAg7wEAAB4AIPABAAAeACDxAQAAtAEAIAsfAADWAgAwIAAA2wIAMOsBAADXAgAw7AEAANgCADDtAQAA2QIAIO4BAADaAgAw7wEAANoCADDwAQAA2gIAMPEBAADaAgAw8gEAANwCADDzAQAA3QIAMAsGAADoAgAgrgEBAAAAAbYBQAAAAAHYAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQgAAAAB4QEAAADhAQLjAQAAAOMBAuQBAQAAAAHlAUAAAAABAgAAACIAIB8AAOcCACADAAAAIgAgHwAA5wIAICAAAOUCACABGAAA-wQAMBABAACjAgAgBgAAvgIAIKsBAAC6AgAwrAEAACAAEK0BAAC6AgAwrgEBAAAAAbYBQACNAgAhygEBAAAAAdgBAQAAAAHdAQEAAAAB3gEBAAAAAd8BCACiAgAh4QEAALsC4QEi4wEAALwC4wEi5AEBAAAAAeUBQAC9AgAhAgAAACIAIBgAAOUCACACAAAA3gIAIBgAAN8CACAOqwEAAN0CADCsAQAA3gIAEK0BAADdAgAwrgEBAIoCACG2AUAAjQIAIcoBAQCKAgAh2AEBAKACACHdAQEAigIAId4BAQCgAgAh3wEIAKICACHhAQAAuwLhASLjAQAAvALjASLkAQEAoAIAIeUBQAC9AgAhDqsBAADdAgAwrAEAAN4CABCtAQAA3QIAMK4BAQCKAgAhtgFAAI0CACHKAQEAigIAIdgBAQCgAgAh3QEBAIoCACHeAQEAoAIAId8BCACiAgAh4QEAALsC4QEi4wEAALwC4wEi5AEBAKACACHlAUAAvQIAIQquAQEAzQIAIbYBQADQAgAh2AEBAOACACHdAQEAzQIAId4BAQDgAgAh3wEIAOECACHhAQAA4gLhASLjAQAA4wLjASLkAQEA4AIAIeUBQADkAgAhAe4BAQAAAAEF7gEIAAAAAfQBCAAAAAH1AQgAAAAB9gEIAAAAAfcBCAAAAAEB7gEAAADhAQIB7gEAAADjAQIB7gFAAAAAAQsGAADmAgAgrgEBAM0CACG2AUAA0AIAIdgBAQDgAgAh3QEBAM0CACHeAQEA4AIAId8BCADhAgAh4QEAAOIC4QEi4wEAAOMC4wEi5AEBAOACACHlAUAA5AIAIQcfAAD2BAAgIAAA-QQAIOsBAAD3BAAg7AEAAPgEACDvAQAABQAg8AEAAAUAIPEBAAABACALBgAA6AIAIK4BAQAAAAG2AUAAAAAB2AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEIAAAAAeEBAAAA4QEC4wEAAADjAQLkAQEAAAAB5QFAAAAAAQMfAAD2BAAg6wEAAPcEACDxAQAAAQAgDQUAANEDACAJAADPAwAgDAAA0AMAIA0AANIDACCuAQEAAAABtgFAAAAAAbcBQAAAAAHLAQEAAAABzAEAAM4DACDNAQIAAAABzgEIAAAAAc8BAQAAAAHQAQgAAAABAgAAALQBACAfAADpAgAgAwAAAB4AIB8AAOkCACAgAADtAgAgDwAAAB4AIAUAAPICACAJAADwAgAgDAAA8QIAIA0AAPMCACAYAADtAgAgrgEBAM0CACG2AUAA0AIAIbcBQADQAgAhywEBAOACACHMAQAA7gIAIM0BAgDvAgAhzgEIAOECACHPAQEA4AIAIdABCADhAgAhDQUAAPICACAJAADwAgAgDAAA8QIAIA0AAPMCACCuAQEAzQIAIbYBQADQAgAhtwFAANACACHLAQEA4AIAIcwBAADuAgAgzQECAO8CACHOAQgA4QIAIc8BAQDgAgAh0AEIAOECACEC7gEBAAAABPgBAQAAAAUF7gECAAAAAfQBAgAAAAH1AQIAAAAB9gECAAAAAfcBAgAAAAELHwAAswMAMCAAALgDADDrAQAAtAMAMOwBAAC1AwAw7QEAALYDACDuAQAAtwMAMO8BAAC3AwAw8AEAALcDADDxAQAAtwMAMPIBAAC5AwAw8wEAALoDADALHwAApwMAMCAAAKwDADDrAQAAqAMAMOwBAACpAwAw7QEAAKoDACDuAQAAqwMAMO8BAACrAwAw8AEAAKsDADDxAQAAqwMAMPIBAACtAwAw8wEAAK4DADALHwAAhAMAMCAAAIkDADDrAQAAhQMAMOwBAACGAwAw7QEAAIcDACDuAQAAiAMAMO8BAACIAwAw8AEAAIgDADDxAQAAiAMAMPIBAACKAwAw8wEAAIsDADALHwAA9AIAMCAAAPkCADDrAQAA9QIAMOwBAAD2AgAw7QEAAPcCACDuAQAA-AIAMO8BAAD4AgAw8AEAAPgCADDxAQAA-AIAMPIBAAD6AgAw8wEAAPsCADAIBgAAggMAIAcAAIMDACCuAQEAAAABtgFAAAAAAdgBAQAAAAHZAQEAAAAB2gECAAAAAdsBAQAAAAECAAAACgAgHwAAgQMAIAMAAAAKACAfAACBAwAgIAAA_gIAIAEYAAD1BAAwDQYAAMQCACAHAACjAgAgCAAAwAIAIKsBAADDAgAwrAEAAAgAEK0BAADDAgAwrgEBAAAAAbYBQACNAgAhxgEBAIoCACHYAQEAAAAB2QEBAIoCACHaAQIAoQIAIdsBAQCgAgAhAgAAAAoAIBgAAP4CACACAAAA_AIAIBgAAP0CACAKqwEAAPsCADCsAQAA_AIAEK0BAAD7AgAwrgEBAIoCACG2AUAAjQIAIcYBAQCKAgAh2AEBAIoCACHZAQEAigIAIdoBAgChAgAh2wEBAKACACEKqwEAAPsCADCsAQAA_AIAEK0BAAD7AgAwrgEBAIoCACG2AUAAjQIAIcYBAQCKAgAh2AEBAIoCACHZAQEAigIAIdoBAgChAgAh2wEBAKACACEGrgEBAM0CACG2AUAA0AIAIdgBAQDNAgAh2QEBAM0CACHaAQIA7wIAIdsBAQDgAgAhCAYAAP8CACAHAACAAwAgrgEBAM0CACG2AUAA0AIAIdgBAQDNAgAh2QEBAM0CACHaAQIA7wIAIdsBAQDgAgAhBR8AAO0EACAgAADzBAAg6wEAAO4EACDsAQAA8gQAIPEBAAABACAFHwAA6wQAICAAAPAEACDrAQAA7AQAIOwBAADvBAAg8QEAAOIBACAIBgAAggMAIAcAAIMDACCuAQEAAAABtgFAAAAAAdgBAQAAAAHZAQEAAAAB2gECAAAAAdsBAQAAAAEDHwAA7QQAIOsBAADuBAAg8QEAAAEAIAMfAADrBAAg6wEAAOwEACDxAQAA4gEAIAsHAACjAwAgEAAApAMAIBEAAKUDACASAACmAwAgrgEBAAAAAbYBQAAAAAG3AUAAAAAB2QEBAAAAAeMBAAAA6QEC5gEBAAAAAecBQAAAAAECAAAAAQAgHwAAogMAIAMAAAABACAfAACiAwAgIAAAjwMAIAEYAADqBAAwEAcAAKMCACAIAADAAgAgEAAAxwIAIBEAAMgCACASAADJAgAgqwEAAMUCADCsAQAABQAQrQEAAMUCADCuAQEAAAABtgFAAI0CACG3AUAAjQIAIcYBAQCKAgAh2QEBAIoCACHjAQAAxgLpASLmAQEAigIAIecBQACNAgAhAgAAAAEAIBgAAI8DACACAAAAjAMAIBgAAI0DACALqwEAAIsDADCsAQAAjAMAEK0BAACLAwAwrgEBAIoCACG2AUAAjQIAIbcBQACNAgAhxgEBAIoCACHZAQEAigIAIeMBAADGAukBIuYBAQCKAgAh5wFAAI0CACELqwEAAIsDADCsAQAAjAMAEK0BAACLAwAwrgEBAIoCACG2AUAAjQIAIbcBQACNAgAhxgEBAIoCACHZAQEAigIAIeMBAADGAukBIuYBAQCKAgAh5wFAAI0CACEHrgEBAM0CACG2AUAA0AIAIbcBQADQAgAh2QEBAM0CACHjAQAAjgPpASLmAQEAzQIAIecBQADQAgAhAe4BAAAA6QECCwcAAJADACAQAACRAwAgEQAAkgMAIBIAAJMDACCuAQEAzQIAIbYBQADQAgAhtwFAANACACHZAQEAzQIAIeMBAACOA-kBIuYBAQDNAgAh5wFAANACACEFHwAA2AQAICAAAOgEACDrAQAA2QQAIOwBAADnBAAg8QEAAOIBACAFHwAA1gQAICAAAOUEACDrAQAA1wQAIOwBAADkBAAg8QEAAA4AIAcfAACbAwAgIAAAngMAIOsBAACcAwAg7AEAAJ0DACDvAQAAIAAg8AEAACAAIPEBAAAiACAHHwAAlAMAICAAAJcDACDrAQAAlQMAIOwBAACWAwAg7wEAAAgAIPABAAAIACDxAQAACgAgCAcAAIMDACAIAACaAwAgrgEBAAAAAbYBQAAAAAHGAQEAAAAB2QEBAAAAAdoBAgAAAAHbAQEAAAABAgAAAAoAIB8AAJQDACADAAAACAAgHwAAlAMAICAAAJgDACAKAAAACAAgBwAAgAMAIAgAAJkDACAYAACYAwAgrgEBAM0CACG2AUAA0AIAIcYBAQDNAgAh2QEBAM0CACHaAQIA7wIAIdsBAQDgAgAhCAcAAIADACAIAACZAwAgrgEBAM0CACG2AUAA0AIAIcYBAQDNAgAh2QEBAM0CACHaAQIA7wIAIdsBAQDgAgAhBR8AAN8EACAgAADiBAAg6wEAAOAEACDsAQAA4QQAIPEBAAC0AQAgAx8AAN8EACDrAQAA4AQAIPEBAAC0AQAgCwEAAKEDACCuAQEAAAABtgFAAAAAAcoBAQAAAAHdAQEAAAAB3gEBAAAAAd8BCAAAAAHhAQAAAOEBAuMBAAAA4wEC5AEBAAAAAeUBQAAAAAECAAAAIgAgHwAAmwMAIAMAAAAgACAfAACbAwAgIAAAnwMAIA0AAAAgACABAACgAwAgGAAAnwMAIK4BAQDNAgAhtgFAANACACHKAQEAzQIAId0BAQDNAgAh3gEBAOACACHfAQgA4QIAIeEBAADiAuEBIuMBAADjAuMBIuQBAQDgAgAh5QFAAOQCACELAQAAoAMAIK4BAQDNAgAhtgFAANACACHKAQEAzQIAId0BAQDNAgAh3gEBAOACACHfAQgA4QIAIeEBAADiAuEBIuMBAADjAuMBIuQBAQDgAgAh5QFAAOQCACEFHwAA2gQAICAAAN0EACDrAQAA2wQAIOwBAADcBAAg8QEAAOIBACADHwAA2gQAIOsBAADbBAAg8QEAAOIBACALBwAAowMAIBAAAKQDACARAAClAwAgEgAApgMAIK4BAQAAAAG2AUAAAAABtwFAAAAAAdkBAQAAAAHjAQAAAOkBAuYBAQAAAAHnAUAAAAABAx8AANgEACDrAQAA2QQAIPEBAADiAQAgAx8AANYEACDrAQAA1wQAIPEBAAAOACADHwAAmwMAIOsBAACcAwAg8QEAACIAIAMfAACUAwAg6wEAAJUDACDxAQAACgAgBK4BAQAAAAHHAQIAAAAByAEBAAAAAckBAQAAAAECAAAAFgAgHwAAsgMAIAMAAAAWACAfAACyAwAgIAAAsQMAIAEYAADVBAAwCQgAAMACACCrAQAAvwIAMKwBAAAUABCtAQAAvwIAMK4BAQAAAAHGAQEAigIAIccBAgChAgAhyAEBAIoCACHJAQEAigIAIQIAAAAWACAYAACxAwAgAgAAAK8DACAYAACwAwAgCKsBAACuAwAwrAEAAK8DABCtAQAArgMAMK4BAQCKAgAhxgEBAIoCACHHAQIAoQIAIcgBAQCKAgAhyQEBAIoCACEIqwEAAK4DADCsAQAArwMAEK0BAACuAwAwrgEBAIoCACHGAQEAigIAIccBAgChAgAhyAEBAIoCACHJAQEAigIAIQSuAQEAzQIAIccBAgDvAgAhyAEBAM0CACHJAQEAzQIAIQSuAQEAzQIAIccBAgDvAgAhyAEBAM0CACHJAQEAzQIAIQSuAQEAAAABxwECAAAAAcgBAQAAAAHJAQEAAAABCQUAAM0DACALAADMAwAgrgEBAAAAAbYBQAAAAAG3AUAAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAAB1wEIAAAAAQIAAAAOACAfAADLAwAgAwAAAA4AIB8AAMsDACAgAAC9AwAgARgAANQEADAOBQAAjwIAIAgAAMACACALAADCAgAgqwEAAMECADCsAQAADAAQrQEAAMECADCuAQEAAAABtgFAAI0CACG3AUAAjQIAIcYBAQCKAgAh1AEBAIoCACHVAQEAigIAIdYBAQCgAgAh1wEIAKICACECAAAADgAgGAAAvQMAIAIAAAC7AwAgGAAAvAMAIAurAQAAugMAMKwBAAC7AwAQrQEAALoDADCuAQEAigIAIbYBQACNAgAhtwFAAI0CACHGAQEAigIAIdQBAQCKAgAh1QEBAIoCACHWAQEAoAIAIdcBCACiAgAhC6sBAAC6AwAwrAEAALsDABCtAQAAugMAMK4BAQCKAgAhtgFAAI0CACG3AUAAjQIAIcYBAQCKAgAh1AEBAIoCACHVAQEAigIAIdYBAQCgAgAh1wEIAKICACEHrgEBAM0CACG2AUAA0AIAIbcBQADQAgAh1AEBAM0CACHVAQEAzQIAIdYBAQDgAgAh1wEIAOECACEJBQAAvwMAIAsAAL4DACCuAQEAzQIAIbYBQADQAgAhtwFAANACACHUAQEAzQIAIdUBAQDNAgAh1gEBAOACACHXAQgA4QIAIQUfAADJBAAgIAAA0gQAIOsBAADKBAAg7AEAANEEACDxAQAAhQEAIAsfAADAAwAwIAAAxAMAMOsBAADBAwAw7AEAAMIDADDtAQAAwwMAIO4BAACIAwAw7wEAAIgDADDwAQAAiAMAMPEBAACIAwAw8gEAAMUDADDzAQAAiwMAMAsHAACjAwAgCAAAygMAIBEAAKUDACASAACmAwAgrgEBAAAAAbYBQAAAAAG3AUAAAAABxgEBAAAAAdkBAQAAAAHjAQAAAOkBAucBQAAAAAECAAAAAQAgHwAAyQMAIAMAAAABACAfAADJAwAgIAAAxwMAIAEYAADQBAAwAgAAAAEAIBgAAMcDACACAAAAjAMAIBgAAMYDACAHrgEBAM0CACG2AUAA0AIAIbcBQADQAgAhxgEBAM0CACHZAQEAzQIAIeMBAACOA-kBIucBQADQAgAhCwcAAJADACAIAADIAwAgEQAAkgMAIBIAAJMDACCuAQEAzQIAIbYBQADQAgAhtwFAANACACHGAQEAzQIAIdkBAQDNAgAh4wEAAI4D6QEi5wFAANACACEFHwAAywQAICAAAM4EACDrAQAAzAQAIOwBAADNBAAg8QEAALQBACALBwAAowMAIAgAAMoDACARAAClAwAgEgAApgMAIK4BAQAAAAG2AUAAAAABtwFAAAAAAcYBAQAAAAHZAQEAAAAB4wEAAADpAQLnAUAAAAABAx8AAMsEACDrAQAAzAQAIPEBAAC0AQAgCQUAAM0DACALAADMAwAgrgEBAAAAAbYBQAAAAAG3AUAAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAAB1wEIAAAAAQMfAADJBAAg6wEAAMoEACDxAQAAhQEAIAQfAADAAwAw6wEAAMEDADDtAQAAwwMAIPEBAACIAwAwAe4BAQAAAAQEHwAAswMAMOsBAAC0AwAw7QEAALYDACDxAQAAtwMAMAQfAACnAwAw6wEAAKgDADDtAQAAqgMAIPEBAACrAwAwBB8AAIQDADDrAQAAhQMAMO0BAACHAwAg8QEAAIgDADAEHwAA9AIAMOsBAAD1AgAw7QEAAPcCACDxAQAA-AIAMAgGAACCAwAgCAAAmgMAIK4BAQAAAAG2AUAAAAABxgEBAAAAAdgBAQAAAAHaAQIAAAAB2wEBAAAAAQIAAAAKACAfAADbAwAgAwAAAAoAIB8AANsDACAgAADaAwAgARgAAMgEADACAAAACgAgGAAA2gMAIAIAAAD8AgAgGAAA2QMAIAauAQEAzQIAIbYBQADQAgAhxgEBAM0CACHYAQEAzQIAIdoBAgDvAgAh2wEBAOACACEIBgAA_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-wMAIAQFAADwAwAgCAAA8gMAIAsAAK4EACDWAQAA-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-XAM_XQNAXwNBYQ5CYh9DZANEZg5FZyBGaANHaQNIag5JbSFKbiVLbwRMcARNcQROcgRPcwRQdQRRdw5SeCZTegRUfA5VfSdWfgRXfwRYgAEOWYMBKFqEAS5bhgEHXIcBB12KAQdeiwEHX4wBB2COAQdhkAEOYpEBL2OTAQdklQEOZZYBMGaXAQdnmAEHaJkBDmmcATFqnQE1a54BBmyfAQZtoAEGbqEBBm-iAQZwpAEGcaYBDnKnATZzqQEGdKsBDnWsATd2rQEGd64BBnivAQ55sgE4erMBPnu1AQV8tgEFfbgBBX65AQV_ugEFgAG8AQWBAb4BDoIBvwE_gwHBAQWEAcMBDoUBxAFAhgHFAQWHAcYBBYgBxwEOiQHKAUGKAcsBR4sBzAEKjAHNAQqNAc4BCo4BzwEKjwHQAQqQAdIBCpEB1AEOkgHVAUiTAdcBCpQB2QEOlQHaAUmWAdsBCpcB3AEKmAHdAQ6ZAeABSpoB4QFQmwHjAQKcAeQBAp0B5wECngHoAQKfAekBAqAB6wECoQHtAQ6iAe4BUaMB8AECpAHyAQ6lAfMBUqYB9AECpwH1AQKoAfYBDqkB-QFTqgH6AVc"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ServiceCategoryScalarFieldEnum: () => ServiceCategoryScalarFieldEnum,
  ServiceScalarFieldEnum: () => ServiceScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TechnicianProfileScalarFieldEnum: () => TechnicianProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.9.0",
  engine: "e922089b7d7502aff4249d5da3420f6fa55fc6ad"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Booking: "Booking",
  Payment: "Payment",
  Profile: "Profile",
  Review: "Review",
  ServiceCategory: "ServiceCategory",
  Service: "Service",
  TechnicianProfile: "TechnicianProfile",
  Availability: "Availability",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var BookingScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  technicianId: "technicianId",
  serviceId: "serviceId",
  scheduledAt: "scheduledAt",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  stripeCustomerId: "stripeCustomerId",
  stripeSubscriptionId: "stripeSubscriptionId",
  userId: "userId",
  amount: "amount",
  method: "method",
  status: "status",
  transactionId: "transactionId",
  paidAt: "paidAt",
  createdAt: "createdAt"
};
var ProfileScalarFieldEnum = {
  id: "id",
  profilePhoto: "profilePhoto",
  bio: "bio",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  customerId: "customerId",
  technicianId: "technicianId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var ServiceCategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt"
};
var ServiceScalarFieldEnum = {
  id: "id",
  technicianId: "technicianId",
  categoryId: "categoryId",
  title: "title",
  description: "description",
  price: "price",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TechnicianProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  skills: "skills",
  experience: "experience",
  hourlyRate: "hourlyRate",
  location: "location",
  avgRating: "avgRating",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  technicianId: "technicianId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  activeStatus: "activeStatus",
  role: "role",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  console.log("Error : ", err);
  let statusCode;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    name: errorName,
    message: errorMessage,
    error: err.stack
  });
};

// src/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    date: /* @__PURE__ */ new Date()
  });
};

// src/modules/user/user.route.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/middlewares/auth.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { email, name, id, role } = verifiedToken.data;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource."
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role
      }
    });
    if (!user) {
      throw new Error("User not found. Please log in again.");
    }
    if (user.activeStatus === "BAN") {
      throw new Error("Your account has been blocked. Please contact support.");
    }
    req.user = {
      email,
      name,
      id,
      role
    };
    next();
  });
};

// src/modules/user/user.controller.ts
import httpStatus2 from "http-status";

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/modules/user/user.service.ts
import bcrypt from "bcryptjs";
var registerUserIntoDB = async (payload) => {
  const { name, email, password, profilePhoto, role } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email }
  });
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        create: {
          profilePhoto
        }
      }
    }
  });
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email
    },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  });
  return user;
};
var getMyProfileFromDB = async (userId) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  });
  return user;
};
var updateMyProfileInDB = async (userId, payload) => {
  const { name, email, profilePhoto, bio } = payload;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio
        }
      }
    },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  });
  return updatedUser;
};
var userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB
};

// src/modules/user/user.controller.ts
var registerUser = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.CREATED,
      message: "User registered successfully",
      data: { user }
    });
  }
);
var getMyProfile = catchAsync(
  async (req, res, next) => {
    const profile = await userService.getMyProfileFromDB(
      req.user?.id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "User profile fetched successfully",
      data: { profile }
    });
  }
);
var updateMyProfile = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const payload = req.body;
    const updatedProfile = await userService.updateMyProfileInDB(
      userId,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus2.OK,
      message: "User profile updated successfully",
      data: { updatedProfile }
    });
  }
);
var userController = {
  registerUser,
  getMyProfile,
  updateMyProfile
};

// src/modules/user/user.route.ts
var router = Router();
router.post("/register", userController.registerUser);
router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  userController.getMyProfile
);
router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  userController.updateMyProfile
);
var userRoutes = router;

// src/modules/auth/auth.routes.ts
import { Router as Router2 } from "express";

// src/modules/auth/auth.controller.ts
import httpStatus3 from "http-status";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email }
  });
  if (user.activeStatus === "BAN") {
    throw new Error("Your account has been blocked. Please contact support.");
  }
  const isPasswordMatched = await bcrypt2.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var refreshToken = async (refreshToken3) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken3,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }
  const { id } = verifiedRefreshToken.data;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  });
  if (user.activeStatus === "BAN") {
    throw new Error("User is blocked!");
  }
  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return { accessToken };
};
var authService = {
  loginUser,
  refreshToken
};

// src/modules/auth/auth.controller.ts
var loginUser2 = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const { accessToken, refreshToken: refreshToken3 } = await authService.loginUser(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 7 day
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "User logged in successfully",
      data: { accessToken, refreshToken: refreshToken3 }
    });
  }
);
var refreshToken2 = catchAsync(
  async (req, res, next) => {
    const refreshToken3 = req.cookies.refreshToken;
    const { accessToken } = await authService.refreshToken(refreshToken3);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus3.OK,
      message: "Token Refreshed Successfully",
      data: {
        accessToken
      }
    });
  }
);
var authController = {
  loginUser: loginUser2,
  refreshToken: refreshToken2
};

// src/modules/auth/auth.routes.ts
var router2 = Router2();
router2.post("/login", authController.loginUser);
router2.post("/refresh-token", authController.refreshToken);
var authRoutes = router2;

// src/modules/service/service.route.ts
import { Router as Router3 } from "express";

// src/modules/service/service.controller.ts
import httpStatus4 from "http-status";

// src/modules/service/service.service.ts
var createServiceIntoDB = async (userId, payload) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (!technicianProfile) {
    throw new Error("Technician profile not found for this user");
  }
  const service = await prisma.service.create({
    data: {
      technicianId: technicianProfile.id,
      ...payload
    }
  });
  return service;
};
var getAllServicesFromDB = async (filters) => {
  const { type, location, minRating } = filters;
  const services = await prisma.service.findMany({
    where: {
      ...type && {
        category: { name: { equals: type, mode: "insensitive" } }
      },
      technician: {
        ...location && {
          location: { contains: location, mode: "insensitive" }
        },
        ...minRating && { avgRating: { gte: minRating } }
      }
    },
    include: { technician: true, category: true }
  });
  return services;
};
var getSingleServiceFromDB = async (id) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { technician: true, category: true }
  });
  if (!service) {
    throw new Error("Service not found");
  }
  return service;
};
var updateServiceInDB = async (id, payload) => {
  await getSingleServiceFromDB(id);
  const updatedService = await prisma.service.update({
    where: { id },
    data: payload
  });
  return updatedService;
};
var deleteServiceFromDB = async (id) => {
  await getSingleServiceFromDB(id);
  const deletedService = await prisma.service.delete({ where: { id } });
  return deletedService;
};
var serviceService = {
  createServiceIntoDB,
  getAllServicesFromDB,
  getSingleServiceFromDB,
  updateServiceInDB,
  deleteServiceFromDB
};

// src/modules/service/service.controller.ts
var createService = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const payload = req.body;
    const service = await serviceService.createServiceIntoDB(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.CREATED,
      message: "Service created successfully",
      data: { service }
    });
  }
);
var getAllServices = catchAsync(
  async (req, res, next) => {
    const { type, location, rating } = req.query;
    const services = await serviceService.getAllServicesFromDB({
      type,
      location,
      minRating: rating ? Number(rating) : void 0
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Services fetched successfully",
      data: { services }
    });
  }
);
var getSingleService = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const service = await serviceService.getSingleServiceFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Service fetched successfully",
      data: { service }
    });
  }
);
var updateService = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedService = await serviceService.updateServiceInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Service updated successfully",
      data: { updatedService }
    });
  }
);
var deleteService = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedService = await serviceService.deleteServiceFromDB(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.OK,
      message: "Service deleted successfully",
      data: { deletedService }
    });
  }
);
var serviceController = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService
};

// src/modules/service/service.route.ts
var router3 = Router3();
router3.post("/", auth(Role.TECHNICIAN), serviceController.createService);
router3.get("/", serviceController.getAllServices);
router3.get("/:id", serviceController.getSingleService);
router3.patch(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  serviceController.updateService
);
router3.delete(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  serviceController.deleteService
);
var serviceRoutes = router3;

// src/modules/technician/technician.route.ts
import { Router as Router4 } from "express";

// src/modules/technician/technician.controller.ts
import httpStatus5 from "http-status";

// src/modules/technician/technician.service.ts
var createTechnicianProfileIntoDB = async (userId, payload) => {
  const existing = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (existing) {
    throw new Error("Technician profile already exists for this user");
  }
  const technicianProfile = await prisma.technicianProfile.create({
    data: {
      userId,
      ...payload
    }
  });
  return technicianProfile;
};
var getAllTechnicianProfilesFromDB = async () => {
  const technicians = await prisma.technicianProfile.findMany({
    include: { user: true, services: true, availability: true }
  });
  return technicians;
};
var getSingleTechnicianProfileFromDB = async (id) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { id },
    include: { user: true, services: true, availability: true, reviews: true }
  });
  if (!technician) {
    throw new Error("Technician profile not found");
  }
  return technician;
};
var updateTechnicianProfileInDB = async (id, payload) => {
  await getSingleTechnicianProfileFromDB(id);
  const updatedTechnician = await prisma.technicianProfile.update({
    where: { id },
    data: payload
  });
  return updatedTechnician;
};
var getTechnicianProfileByUserIdFromDB = async (userId) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: { user: true, services: true, availability: true, reviews: true }
  });
  if (!technician) {
    throw new Error("Technician profile not found for this user");
  }
  return technician;
};
var updateTechnicianProfileByUserIdInDB = async (userId, payload) => {
  const technician = await getTechnicianProfileByUserIdFromDB(userId);
  const updatedTechnician = await prisma.technicianProfile.update({
    where: { id: technician.id },
    data: payload
  });
  return updatedTechnician;
};
var deleteTechnicianProfileFromDB = async (id) => {
  await getSingleTechnicianProfileFromDB(id);
  const deletedTechnician = await prisma.technicianProfile.delete({
    where: { id }
  });
  return deletedTechnician;
};
var technicianService = {
  createTechnicianProfileIntoDB,
  getAllTechnicianProfilesFromDB,
  getSingleTechnicianProfileFromDB,
  getTechnicianProfileByUserIdFromDB,
  updateTechnicianProfileByUserIdInDB,
  updateTechnicianProfileInDB,
  deleteTechnicianProfileFromDB
};

// src/modules/technician/technician.controller.ts
var createTechnicianProfile = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const payload = req.body;
    const technicianProfile = await technicianService.createTechnicianProfileIntoDB(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.CREATED,
      message: "Technician profile created successfully",
      data: { technicianProfile }
    });
  }
);
var getAllTechnicianProfiles = catchAsync(
  async (req, res, next) => {
    const technicians = await technicianService.getAllTechnicianProfilesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Technician profiles fetched successfully",
      data: { technicians }
    });
  }
);
var getSingleTechnicianProfile = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const technician = await technicianService.getSingleTechnicianProfileFromDB(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Technician profile fetched successfully",
      data: { technician }
    });
  }
);
var updateTechnicianProfile = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedTechnician = await technicianService.updateTechnicianProfileInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Technician profile updated successfully",
      data: { updatedTechnician }
    });
  }
);
var deleteTechnicianProfile = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedTechnician = await technicianService.deleteTechnicianProfileFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Technician profile deleted successfully",
      data: { deletedTechnician }
    });
  }
);
var technicianController = {
  createTechnicianProfile,
  getAllTechnicianProfiles,
  getSingleTechnicianProfile,
  updateTechnicianProfile,
  deleteTechnicianProfile
};

// src/modules/technician/technician.route.ts
var router4 = Router4();
router4.post(
  "/",
  auth(Role.TECHNICIAN),
  technicianController.createTechnicianProfile
);
router4.get("/", technicianController.getAllTechnicianProfiles);
router4.get("/:id", technicianController.getSingleTechnicianProfile);
router4.patch(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  technicianController.updateTechnicianProfile
);
router4.delete(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  technicianController.deleteTechnicianProfile
);
var technicianRoutes = router4;

// src/modules/booking/booking.route.ts
import { Router as Router5 } from "express";

// src/modules/booking/booking.controller.ts
import httpStatus6 from "http-status";

// src/modules/booking/booking.service.ts
var createBookingIntoDB = async (customerId, payload) => {
  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId,
      scheduledAt: new Date(payload.scheduledAt)
    }
  });
  return booking;
};
var getAllBookingsFromDB = async (customerId, technicianId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      ...customerId && { customerId },
      ...technicianId && { technicianId }
    },
    include: { customer: true, technician: true, service: true, payment: true, review: true }
  });
  return bookings;
};
var getSingleBookingFromDB = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { customer: true, technician: true, service: true, payment: true, review: true }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  return booking;
};
var updateBookingInDB = async (id, payload) => {
  await getSingleBookingFromDB(id);
  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      ...payload.scheduledAt && { scheduledAt: new Date(payload.scheduledAt) }
    }
  });
  return updatedBooking;
};
var updateBookingStatusInDB = async (id, payload) => {
  await getSingleBookingFromDB(id);
  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status: payload.status }
  });
  return updatedBooking;
};
var getBookingsForTechnicianUserFromDB = async (userId) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (!technicianProfile) {
    throw new Error("Technician profile not found for this user");
  }
  const bookings = await prisma.booking.findMany({
    where: { technicianId: technicianProfile.id },
    include: { customer: true, service: true, payment: true, review: true }
  });
  return bookings;
};
var updateBookingStatusForTechnicianUserInDB = async (userId, bookingId, payload) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (!technicianProfile) {
    throw new Error("Technician profile not found for this user");
  }
  const booking = await getSingleBookingFromDB(bookingId);
  if (booking.technicianId !== technicianProfile.id) {
    throw new Error("You are not allowed to update this booking");
  }
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: payload.status }
  });
  return updatedBooking;
};
var deleteBookingFromDB = async (id) => {
  await getSingleBookingFromDB(id);
  const deletedBooking = await prisma.booking.delete({ where: { id } });
  return deletedBooking;
};
var bookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  getBookingsForTechnicianUserFromDB,
  updateBookingStatusForTechnicianUserInDB,
  updateBookingInDB,
  updateBookingStatusInDB,
  deleteBookingFromDB
};

// src/modules/booking/booking.controller.ts
var createBooking = catchAsync(
  async (req, res, next) => {
    const customerId = req.user?.id;
    const payload = req.body;
    const booking = await bookingService.createBookingIntoDB(
      customerId,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "Booking created successfully",
      data: { booking }
    });
  }
);
var getAllBookings = catchAsync(
  async (req, res, next) => {
    const { customerId, technicianId } = req.query;
    const bookings = await bookingService.getAllBookingsFromDB(
      customerId,
      technicianId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Bookings fetched successfully",
      data: { bookings }
    });
  }
);
var getSingleBooking = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const booking = await bookingService.getSingleBookingFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Booking fetched successfully",
      data: { booking }
    });
  }
);
var updateBooking = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedBooking = await bookingService.updateBookingInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Booking updated successfully",
      data: { updatedBooking }
    });
  }
);
var updateBookingStatus = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedBooking = await bookingService.updateBookingStatusInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Booking status updated successfully",
      data: { updatedBooking }
    });
  }
);
var deleteBooking = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedBooking = await bookingService.deleteBookingFromDB(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Booking deleted successfully",
      data: { deletedBooking }
    });
  }
);
var bookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking
};

// src/modules/booking/booking.route.ts
var router5 = Router5();
router5.post("/", auth(Role.CUSTOMER), bookingController.createBooking);
router5.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getAllBookings
);
router5.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getSingleBooking
);
router5.patch(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  bookingController.updateBooking
);
router5.patch(
  "/:id/status",
  auth(Role.TECHNICIAN, Role.ADMIN),
  bookingController.updateBookingStatus
);
router5.delete(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  bookingController.deleteBooking
);
var bookingRoutes = router5;

// src/modules/payment/payment.route.ts
import { Router as Router6 } from "express";

// src/modules/payment/payment.controller.ts
import httpStatus7 from "http-status";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/modules/payment/payment.service.ts
var createPaymentIntoDB = async (payload) => {
  const existing = await prisma.payment.findUnique({
    where: { bookingId: payload.bookingId }
  });
  if (existing) {
    throw new Error("Payment already exists for this booking");
  }
  const payment = await prisma.payment.create({ data: payload });
  return payment;
};
var createCheckoutSession = async (userId) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId
      },
      include: {
        payments: true
      }
    });
    const payment = user.payments.find((payment2) => payment2.stripeCustomerId);
    let stripeCustomerId = payment?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id
        }
      });
      stripeCustomerId = customer.id;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config_default.stripe_price_id,
          quantity: 1
        }
      ],
      mode: "payment",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config_default.app_url}/premium?success=true`,
      cancel_url: `${config_default.app_url}/payment?success=false`,
      metadata: { userId: user.id }
    });
    return session.url;
  });
  return { paymentUrl: transactionResult };
};
var handleWebhook = async (payload, signature) => {
  const endpointSecret = config_default.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
      if (!userId || !stripeCustomerId || !paymentIntentId) {
        throw new Error("Payment data is incomplete");
      }
      if (session.payment_status !== "paid") {
        throw new Error("Payment is not completed");
      }
      const payment = await prisma.payment.upsert({
        where: {
          userId
        },
        create: {
          userId,
          stripeCustomerId,
          amount: (session.amount_total ?? 0) / 100,
          method: "STRIPE",
          status: "PAID",
          transactionId: paymentIntentId,
          paidAt: /* @__PURE__ */ new Date()
        },
        update: {
          stripeCustomerId,
          amount: (session.amount_total ?? 0) / 100,
          method: "STRIPE",
          status: "PAID",
          transactionId: paymentIntentId,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }
};
var getAllPaymentsFromDB = async (userId, role) => {
  const payments = await prisma.payment.findMany({
    where: role === Role.ADMIN ? {} : role === Role.TECHNICIAN ? { booking: { technician: { userId } } } : { booking: { customerId: userId } },
    include: { booking: true }
  });
  return payments;
};
var getSinglePaymentFromDB = async (id) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { booking: true }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};
var getPaymentByBookingFromDB = async (bookingId) => {
  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};
var updatePaymentInDB = async (id, payload) => {
  await getSinglePaymentFromDB(id);
  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: payload
  });
  return updatedPayment;
};
var updatePaymentStatusInDB = async (id, payload) => {
  await getSinglePaymentFromDB(id);
  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: {
      status: payload.status,
      paidAt: payload.status === PaymentStatus.PAID ? /* @__PURE__ */ new Date() : void 0
    }
  });
  return updatedPayment;
};
var confirmPaymentInDB = async (payload) => {
  const payment = await prisma.payment.findUnique({
    where: { bookingId: payload.bookingId }
  });
  if (!payment) {
    throw new Error("Payment not found for this booking");
  }
  const confirmedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      transactionId: payload.transactionId,
      status: payload.status,
      paidAt: payload.status === PaymentStatus.PAID ? /* @__PURE__ */ new Date() : void 0
    }
  });
  return confirmedPayment;
};
var deletePaymentFromDB = async (id) => {
  await getSinglePaymentFromDB(id);
  const deletedPayment = await prisma.payment.delete({ where: { id } });
  return deletedPayment;
};
var paymentService = {
  createPaymentIntoDB,
  createCheckoutSession,
  handleWebhook,
  getAllPaymentsFromDB,
  getSinglePaymentFromDB,
  getPaymentByBookingFromDB,
  confirmPaymentInDB,
  updatePaymentInDB,
  updatePaymentStatusInDB,
  deletePaymentFromDB
};

// src/modules/payment/payment.controller.ts
var createPayment = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const payment = await paymentService.createPaymentIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.CREATED,
      message: "Payment created successfully",
      data: { payment }
    });
  }
);
var creteCheckoutSession = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const result = await paymentService.createCheckoutSession(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.CREATED,
      message: "Checkout create successfully",
      data: result
    });
  }
);
var handleWebhook2 = catchAsync(
  async (req, res, next) => {
    const event = req.body;
    const signature = req.headers["stripe-signature"];
    await paymentService.handleWebhook(event, signature);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Webhook fetched successfully",
      data: null
    });
  }
);
var getAllPayments = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    const payments = await paymentService.getAllPaymentsFromDB(userId, role);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Payments fetched successfully",
      data: { payments }
    });
  }
);
var getSinglePayment = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payment = await paymentService.getSinglePaymentFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Payment fetched successfully",
      data: { payment }
    });
  }
);
var getPaymentByBooking = catchAsync(
  async (req, res, next) => {
    const { bookingId } = req.params;
    const payment = await paymentService.getPaymentByBookingFromDB(
      bookingId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Payment fetched successfully",
      data: { payment }
    });
  }
);
var confirmPayment = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const confirmedPayment = await paymentService.confirmPaymentInDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Payment confirmed successfully",
      data: { confirmedPayment }
    });
  }
);
var updatePayment = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedPayment = await paymentService.updatePaymentInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Payment updated successfully",
      data: { updatedPayment }
    });
  }
);
var updatePaymentStatus = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedPayment = await paymentService.updatePaymentStatusInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Payment status updated successfully",
      data: { updatedPayment }
    });
  }
);
var deletePayment = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedPayment = await paymentService.deletePaymentFromDB(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus7.OK,
      message: "Payment deleted successfully",
      data: { deletedPayment }
    });
  }
);
var paymentController = {
  createPayment,
  creteCheckoutSession,
  handleWebhook: handleWebhook2,
  confirmPayment,
  getAllPayments,
  getSinglePayment,
  getPaymentByBooking,
  updatePayment,
  updatePaymentStatus,
  deletePayment
};

// src/modules/payment/payment.route.ts
var router6 = Router6();
router6.post("/create", auth(Role.CUSTOMER), paymentController.createPayment);
router6.post("/confirm", paymentController.confirmPayment);
router6.post(
  "/checkout",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.creteCheckoutSession
);
router6.post("/webhook", paymentController.handleWebhook);
router6.get(
  "/",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getAllPayments
);
router6.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getSinglePayment
);
router6.get(
  "/booking/:bookingId",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getPaymentByBooking
);
router6.patch("/:id", auth(Role.ADMIN), paymentController.updatePayment);
router6.patch(
  "/:id/status",
  auth(Role.ADMIN),
  paymentController.updatePaymentStatus
);
router6.delete("/:id", auth(Role.ADMIN), paymentController.deletePayment);
var paymentRoutes = router6;

// src/modules/review/review.route.ts
import { Router as Router7 } from "express";

// src/modules/review/review.controller.ts
import httpStatus8 from "http-status";

// src/modules/review/review.service.ts
var recalculateAvgRating = async (technicianId) => {
  const result = await prisma.review.aggregate({
    where: { technicianId },
    _avg: { rating: true }
  });
  await prisma.technicianProfile.update({
    where: { id: technicianId },
    data: { avgRating: result._avg.rating ?? 0 }
  });
};
var createReviewIntoDB = async (customerId, payload) => {
  const existing = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId }
  });
  if (existing) {
    throw new Error("A review already exists for this booking");
  }
  const review = await prisma.review.create({
    data: {
      customerId,
      ...payload
    }
  });
  await recalculateAvgRating(payload.technicianId);
  return review;
};
var getAllReviewsFromDB = async (technicianId) => {
  const reviews = await prisma.review.findMany({
    where: { ...technicianId && { technicianId } },
    include: { customer: true, technician: true, booking: true }
  });
  return reviews;
};
var getSingleReviewFromDB = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: { customer: true, technician: true, booking: true }
  });
  if (!review) {
    throw new Error("Review not found");
  }
  return review;
};
var updateReviewInDB = async (id, payload) => {
  const review = await getSingleReviewFromDB(id);
  const updatedReview = await prisma.review.update({
    where: { id },
    data: payload
  });
  if (payload.rating !== void 0) {
    await recalculateAvgRating(review.technicianId);
  }
  return updatedReview;
};
var deleteReviewFromDB = async (id) => {
  const review = await getSingleReviewFromDB(id);
  const deletedReview = await prisma.review.delete({ where: { id } });
  await recalculateAvgRating(review.technicianId);
  return deletedReview;
};
var reviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  updateReviewInDB,
  deleteReviewFromDB
};

// src/modules/review/review.controller.ts
var createReview = catchAsync(
  async (req, res, next) => {
    const customerId = req.user?.id;
    const payload = req.body;
    const review = await reviewService.createReviewIntoDB(customerId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.CREATED,
      message: "Review created successfully",
      data: { review }
    });
  }
);
var getAllReviews = catchAsync(
  async (req, res, next) => {
    const { technicianId } = req.query;
    const reviews = await reviewService.getAllReviewsFromDB(
      technicianId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Reviews fetched successfully",
      data: { reviews }
    });
  }
);
var getSingleReview = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const review = await reviewService.getSingleReviewFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Review fetched successfully",
      data: { review }
    });
  }
);
var updateReview = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedReview = await reviewService.updateReviewInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Review updated successfully",
      data: { updatedReview }
    });
  }
);
var deleteReview = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedReview = await reviewService.deleteReviewFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Review deleted successfully",
      data: { deletedReview }
    });
  }
);
var reviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
};

// src/modules/review/review.route.ts
var router7 = Router7();
router7.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router7.get("/", reviewController.getAllReviews);
router7.get("/:id", reviewController.getSingleReview);
router7.patch(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  reviewController.updateReview
);
router7.delete(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  reviewController.deleteReview
);
var reviewRoutes = router7;

// src/modules/service-category/serviceCategory.route.ts
import { Router as Router8 } from "express";

// src/modules/service-category/serviceCategory.controller.ts
import httpStatus9 from "http-status";

// src/modules/service-category/serviceCategory.service.ts
var createServiceCategoryIntoDB = async (payload) => {
  const serviceCategory = await prisma.serviceCategory.create({ data: payload });
  return serviceCategory;
};
var getAllServiceCategoriesFromDB = async () => {
  const serviceCategories = await prisma.serviceCategory.findMany({
    include: { services: true }
  });
  return serviceCategories;
};
var getSingleServiceCategoryFromDB = async (id) => {
  const serviceCategory = await prisma.serviceCategory.findUnique({
    where: { id },
    include: { services: true }
  });
  if (!serviceCategory) {
    throw new Error("Service category not found");
  }
  return serviceCategory;
};
var updateServiceCategoryInDB = async (id, payload) => {
  await getSingleServiceCategoryFromDB(id);
  const updatedServiceCategory = await prisma.serviceCategory.update({
    where: { id },
    data: payload
  });
  return updatedServiceCategory;
};
var deleteServiceCategoryFromDB = async (id) => {
  await getSingleServiceCategoryFromDB(id);
  const deletedServiceCategory = await prisma.serviceCategory.delete({
    where: { id }
  });
  return deletedServiceCategory;
};
var serviceCategoryService = {
  createServiceCategoryIntoDB,
  getAllServiceCategoriesFromDB,
  getSingleServiceCategoryFromDB,
  updateServiceCategoryInDB,
  deleteServiceCategoryFromDB
};

// src/modules/service-category/serviceCategory.controller.ts
var createServiceCategory = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const serviceCategory = await serviceCategoryService.createServiceCategoryIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.CREATED,
      message: "Service category created successfully",
      data: { serviceCategory }
    });
  }
);
var getAllServiceCategories = catchAsync(
  async (req, res, next) => {
    const serviceCategories = await serviceCategoryService.getAllServiceCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Service categories fetched successfully",
      data: { serviceCategories }
    });
  }
);
var getSingleServiceCategory = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const serviceCategory = await serviceCategoryService.getSingleServiceCategoryFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Service category fetched successfully",
      data: { serviceCategory }
    });
  }
);
var updateServiceCategory = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedServiceCategory = await serviceCategoryService.updateServiceCategoryInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Service category updated successfully",
      data: { updatedServiceCategory }
    });
  }
);
var deleteServiceCategory = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedServiceCategory = await serviceCategoryService.deleteServiceCategoryFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Service category deleted successfully",
      data: { deletedServiceCategory }
    });
  }
);
var serviceCategoryController = {
  createServiceCategory,
  getAllServiceCategories,
  getSingleServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
};

// src/modules/service-category/serviceCategory.route.ts
var router8 = Router8();
router8.post(
  "/",
  auth(Role.ADMIN),
  serviceCategoryController.createServiceCategory
);
router8.get("/", serviceCategoryController.getAllServiceCategories);
router8.get("/:id", serviceCategoryController.getSingleServiceCategory);
router8.patch(
  "/:id",
  auth(Role.ADMIN),
  serviceCategoryController.updateServiceCategory
);
router8.delete(
  "/:id",
  auth(Role.ADMIN),
  serviceCategoryController.deleteServiceCategory
);
var serviceCategoryRoutes = router8;

// src/modules/profile/profile.route.ts
import { Router as Router9 } from "express";

// src/modules/profile/profile.controller.ts
import httpStatus10 from "http-status";

// src/modules/profile/profile.service.ts
var createProfileIntoDB = async (userId, payload) => {
  const existing = await prisma.profile.findUnique({ where: { userId } });
  if (existing) {
    throw new Error("Profile already exists for this user");
  }
  const profile = await prisma.profile.create({
    data: {
      userId,
      ...payload
    }
  });
  return profile;
};
var getAllProfilesFromDB = async () => {
  const profiles = await prisma.profile.findMany({
    include: { user: true }
  });
  return profiles;
};
var getSingleProfileFromDB = async (id) => {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
};
var getProfileByUserIdFromDB = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { user: true }
  });
  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
};
var updateProfileInDB = async (id, payload) => {
  await getSingleProfileFromDB(id);
  const updatedProfile = await prisma.profile.update({
    where: { id },
    data: payload
  });
  return updatedProfile;
};
var deleteProfileFromDB = async (id) => {
  await getSingleProfileFromDB(id);
  const deletedProfile = await prisma.profile.delete({ where: { id } });
  return deletedProfile;
};
var profileService = {
  createProfileIntoDB,
  getAllProfilesFromDB,
  getSingleProfileFromDB,
  getProfileByUserIdFromDB,
  updateProfileInDB,
  deleteProfileFromDB
};

// src/modules/profile/profile.controller.ts
var createProfile = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const payload = req.body;
    const profile = await profileService.createProfileIntoDB(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.CREATED,
      message: "Profile created successfully",
      data: { profile }
    });
  }
);
var getAllProfiles = catchAsync(
  async (req, res, next) => {
    const profiles = await profileService.getAllProfilesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Profiles fetched successfully",
      data: { profiles }
    });
  }
);
var getSingleProfile = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const profile = await profileService.getSingleProfileFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Profile fetched successfully",
      data: { profile }
    });
  }
);
var updateProfile = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedProfile = await profileService.updateProfileInDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Profile updated successfully",
      data: { updatedProfile }
    });
  }
);
var deleteProfile = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedProfile = await profileService.deleteProfileFromDB(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus10.OK,
      message: "Profile deleted successfully",
      data: { deletedProfile }
    });
  }
);
var profileController = {
  createProfile,
  getAllProfiles,
  getSingleProfile,
  updateProfile,
  deleteProfile
};

// src/modules/profile/profile.route.ts
var router9 = Router9();
router9.post("/", auth(), profileController.createProfile);
router9.get("/", auth(Role.ADMIN), profileController.getAllProfiles);
router9.get("/:id", auth(), profileController.getSingleProfile);
router9.patch("/:id", auth(), profileController.updateProfile);
router9.delete("/:id", auth(Role.ADMIN), profileController.deleteProfile);
var profileRoutes = router9;

// src/modules/availability/availability.route.ts
import { Router as Router10 } from "express";

// src/modules/availability/availability.controller.ts
import httpStatus11 from "http-status";

// src/modules/availability/availability.service.ts
var createAvailabilityIntoDB = async (technicianId, payload) => {
  const availability = await prisma.availability.create({
    data: {
      technicianId,
      ...payload
    }
  });
  return availability;
};
var getAvailabilityForTechnicianFromDB = async (technicianId) => {
  const availability = await prisma.availability.findMany({
    where: { technicianId }
  });
  return availability;
};
var getSingleAvailabilityFromDB = async (id) => {
  const availability = await prisma.availability.findUnique({ where: { id } });
  if (!availability) {
    throw new Error("Availability slot not found");
  }
  return availability;
};
var updateAvailabilityInDB = async (id, payload) => {
  await getSingleAvailabilityFromDB(id);
  const updatedAvailability = await prisma.availability.update({
    where: { id },
    data: payload
  });
  return updatedAvailability;
};
var replaceAvailabilityForTechnicianInDB = async (technicianId, slots) => {
  const result = await prisma.$transaction([
    prisma.availability.deleteMany({ where: { technicianId } }),
    prisma.availability.createMany({
      data: slots.map((slot) => ({ ...slot, technicianId }))
    })
  ]);
  const availability = await prisma.availability.findMany({
    where: { technicianId }
  });
  return availability;
};
var deleteAvailabilityFromDB = async (id) => {
  await getSingleAvailabilityFromDB(id);
  const deletedAvailability = await prisma.availability.delete({ where: { id } });
  return deletedAvailability;
};
var availabilityService = {
  createAvailabilityIntoDB,
  getAvailabilityForTechnicianFromDB,
  getSingleAvailabilityFromDB,
  replaceAvailabilityForTechnicianInDB,
  updateAvailabilityInDB,
  deleteAvailabilityFromDB
};

// src/modules/availability/availability.controller.ts
var createAvailability = catchAsync(
  async (req, res, next) => {
    const { technicianId } = req.params;
    const payload = req.body;
    const availability = await availabilityService.createAvailabilityIntoDB(
      technicianId,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus11.CREATED,
      message: "Availability slot created successfully",
      data: { availability }
    });
  }
);
var getAvailabilityForTechnician = catchAsync(
  async (req, res, next) => {
    const { technicianId } = req.params;
    const availability = await availabilityService.getAvailabilityForTechnicianFromDB(
      technicianId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Availability fetched successfully",
      data: { availability }
    });
  }
);
var updateAvailability = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedAvailability = await availabilityService.updateAvailabilityInDB(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Availability slot updated successfully",
      data: { updatedAvailability }
    });
  }
);
var deleteAvailability = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const deletedAvailability = await availabilityService.deleteAvailabilityFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Availability slot deleted successfully",
      data: { deletedAvailability }
    });
  }
);
var availabilityController = {
  createAvailability,
  getAvailabilityForTechnician,
  updateAvailability,
  deleteAvailability
};

// src/modules/availability/availability.route.ts
var router10 = Router10({ mergeParams: true });
router10.post(
  "/technicians/:technicianId/availability",
  auth(Role.TECHNICIAN),
  availabilityController.createAvailability
);
router10.get(
  "/technicians/:technicianId/availability",
  availabilityController.getAvailabilityForTechnician
);
router10.patch(
  "/availability/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  availabilityController.updateAvailability
);
router10.delete(
  "/availability/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  availabilityController.deleteAvailability
);
var availabilityRoutes = router10;

// src/modules/technician-panel/technicianPanel.route.ts
import { Router as Router11 } from "express";

// src/modules/technician-panel/technicianPanel.controller.ts
import httpStatus12 from "http-status";
var updateMyTechnicianProfile = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const payload = req.body;
    const updatedProfile = await technicianService.updateTechnicianProfileByUserIdInDB(
      userId,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus12.OK,
      message: "Technician profile updated successfully",
      data: { updatedProfile }
    });
  }
);
var updateMyAvailability = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const { availability } = req.body;
    const technicianProfile = await technicianService.getTechnicianProfileByUserIdFromDB(userId);
    const updatedAvailability = await availabilityService.replaceAvailabilityForTechnicianInDB(
      technicianProfile.id,
      availability
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus12.OK,
      message: "Availability updated successfully",
      data: { availability: updatedAvailability }
    });
  }
);
var getMyBookings = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const bookings = await bookingService.getBookingsForTechnicianUserFromDB(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus12.OK,
      message: "Bookings fetched successfully",
      data: { bookings }
    });
  }
);
var updateMyBookingStatus = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const payload = req.body;
    const updatedBooking = await bookingService.updateBookingStatusForTechnicianUserInDB(
      userId,
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus12.OK,
      message: "Booking status updated successfully",
      data: { updatedBooking }
    });
  }
);
var technicianPanelController = {
  updateMyTechnicianProfile,
  updateMyAvailability,
  getMyBookings,
  updateMyBookingStatus
};

// src/modules/technician-panel/technicianPanel.route.ts
var router11 = Router11();
router11.put(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianPanelController.updateMyTechnicianProfile
);
router11.put(
  "/availability",
  auth(Role.TECHNICIAN),
  technicianPanelController.updateMyAvailability
);
router11.get(
  "/bookings",
  auth(Role.TECHNICIAN),
  technicianPanelController.getMyBookings
);
router11.patch(
  "/bookings/:id",
  auth(Role.TECHNICIAN),
  technicianPanelController.updateMyBookingStatus
);
var technicianPanelRoutes = router11;

// src/modules/admin/admin.route.ts
import { Router as Router12 } from "express";

// src/modules/admin/admin.controller.ts
import httpStatus13 from "http-status";

// src/modules/admin/admin.service.ts
var getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
    include: { profile: true, technicianProfile: true }
  });
  return users;
};
var updateUserStatusInDB = async (id, payload) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { activeStatus: payload.activeStatus },
    omit: { password: true }
  });
  return updatedUser;
};
var getAllBookingsFromDB2 = async () => {
  const bookings = await prisma.booking.findMany({
    include: { customer: true, technician: true, service: true, payment: true, review: true }
  });
  return bookings;
};
var adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllBookingsFromDB: getAllBookingsFromDB2
};

// src/modules/admin/admin.controller.ts
var getAllUsers = catchAsync(
  async (req, res, next) => {
    const users = await adminService.getAllUsersFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus13.OK,
      message: "Users fetched successfully",
      data: { users }
    });
  }
);
var updateUserStatus = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedUser = await adminService.updateUserStatusInDB(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus13.OK,
      message: "User status updated successfully",
      data: { updatedUser }
    });
  }
);
var getAllBookings2 = catchAsync(
  async (req, res, next) => {
    const bookings = await adminService.getAllBookingsFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus13.OK,
      message: "Bookings fetched successfully",
      data: { bookings }
    });
  }
);
var getAllCategories = catchAsync(
  async (req, res, next) => {
    const categories = await serviceCategoryService.getAllServiceCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus13.OK,
      message: "Categories fetched successfully",
      data: { categories }
    });
  }
);
var createCategory = catchAsync(
  async (req, res, next) => {
    const payload = req.body;
    const category = await serviceCategoryService.createServiceCategoryIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus13.CREATED,
      message: "Category created successfully",
      data: { category }
    });
  }
);
var adminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings: getAllBookings2,
  getAllCategories,
  createCategory
};

// src/modules/admin/admin.route.ts
var router12 = Router12();
router12.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router12.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router12.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings);
router12.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);
router12.post("/categories", auth(Role.ADMIN), adminController.createCategory);
var adminRoutes = router12;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: config_default.app_url,
    credentials: true
  })
);
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", serviceCategoryRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/technician", technicianPanelRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var port = config_default.port || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app_default.listen(port, () => {
      console.log(`Server is running port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map