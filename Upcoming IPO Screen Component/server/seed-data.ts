import { db } from "./db";
import { ipos, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function seedDemoData() {
  // Create admin user if not exists
  const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
  }

  // Clear existing IPOs
  await db.delete(ipos);

  // Insert demo IPO data matching your Figma designs
  const demoIpos = [
    {
      companyName: "Nova Agritech Ltd.",
      sector: "Technology",
      openDate: new Date("2024-01-22"),
      closeDate: new Date("2024-01-24"),
      minPrice: "39",
      maxPrice: "41",
      lotSize: 365,
      issueSize: "143.81",
      status: "upcoming",
      rhpLink: "/rhp/nova-agritech.pdf",
      description: "Nova Agritech is a leading agricultural technology company focused on sustainable farming solutions.",
      logoInitials: "Nova",
      logoColor: "blue"
    },
    {
      companyName: "EPACK Durable Ltd.",
      sector: "Manufacturing",
      openDate: new Date("2024-01-19"),
      closeDate: new Date("2024-01-23"),
      minPrice: "218",
      maxPrice: "230",
      lotSize: 65,
      issueSize: "640.05",
      status: "ongoing",
      rhpLink: "/rhp/epack-durable.pdf",
      description: "EPACK Durable specializes in manufacturing durable packaging solutions for various industries.",
      logoInitials: "EPACK",
      logoColor: "green"
    },
    {
      companyName: "RK Swamy Ltd.",
      sector: "Finance",
      openDate: new Date("2024-01-25"),
      closeDate: new Date("2024-01-29"),
      minPrice: "0",
      maxPrice: "0",
      lotSize: 100,
      issueSize: "0",
      status: "upcoming",
      rhpLink: "/rhp/rk-swamy.pdf",
      description: "RK Swamy is a comprehensive financial services and marketing communication company.",
      logoInitials: "RK",
      logoColor: "orange"
    },
    {
      companyName: "Piyush Steel Ltd.",
      sector: "Manufacturing",
      openDate: new Date("2024-01-15"),
      closeDate: new Date("2024-01-19"),
      minPrice: "120",
      maxPrice: "135",
      lotSize: 100,
      issueSize: "450.25",
      status: "closed",
      rhpLink: "/rhp/piyush-steel.pdf",
      description: "Piyush Steel is a leading manufacturer of high-quality steel products for construction and infrastructure.",
      logoInitials: "PSL",
      logoColor: "gray"
    },
    {
      companyName: "Dooil Manufacturing Ltd.",
      sector: "Manufacturing",
      openDate: new Date("2024-02-01"),
      closeDate: new Date("2024-02-05"),
      minPrice: "85",
      maxPrice: "95",
      lotSize: 150,
      issueSize: "320.75",
      status: "upcoming",
      rhpLink: "/rhp/dooil-manufacturing.pdf",
      description: "Dooil Manufacturing specializes in precision engineering and manufacturing solutions.",
      logoInitials: "Dooil",
      logoColor: "purple"
    },
    {
      companyName: "Suraksha Diagnostic Ltd.",
      sector: "Healthcare",
      openDate: new Date("2024-01-28"),
      closeDate: new Date("2024-02-01"),
      minPrice: "180",
      maxPrice: "200",
      lotSize: 75,
      issueSize: "890.50",
      status: "upcoming",
      rhpLink: "/rhp/suraksha-diagnostic.pdf",
      description: "Suraksha Diagnostic is a leading healthcare diagnostics company providing comprehensive medical testing services.",
      logoInitials: "SD",
      logoColor: "red"
    },
    {
      companyName: "Zed Information Systems Ltd.",
      sector: "Technology",
      openDate: new Date("2024-02-10"),
      closeDate: new Date("2024-02-14"),
      minPrice: "250",
      maxPrice: "280",
      lotSize: 50,
      issueSize: "1250.00",
      status: "upcoming",
      rhpLink: "/rhp/zed-information.pdf",
      description: "Zed Information Systems is a technology company specializing in enterprise software solutions.",
      logoInitials: "ZIS",
      logoColor: "teal"
    },
    {
      companyName: "Benchmark Quality Ltd.",
      sector: "Electronics",
      openDate: new Date("2024-01-30"),
      closeDate: new Date("2024-02-03"),
      minPrice: "160",
      maxPrice: "175",
      lotSize: 80,
      issueSize: "620.30",
      status: "upcoming",
      rhpLink: "/rhp/benchmark-quality.pdf",
      description: "Benchmark Quality is a leading electronics manufacturing company focusing on quality assurance.",
      logoInitials: "BQ",
      logoColor: "blue"
    },
    {
      companyName: "CMS Green Technologies Ltd.",
      sector: "Technology",
      openDate: new Date("2024-02-05"),
      closeDate: new Date("2024-02-09"),
      minPrice: "300",
      maxPrice: "320",
      lotSize: 45,
      issueSize: "980.75",
      status: "upcoming",
      rhpLink: "/rhp/cms-green.pdf",
      description: "CMS Green Technologies develops sustainable technology solutions for environmental conservation.",
      logoInitials: "CMS",
      logoColor: "green"
    },
    {
      companyName: "Jammu Textiles Ltd.",
      sector: "Retail",
      openDate: new Date("2024-02-12"),
      closeDate: new Date("2024-02-16"),
      minPrice: "95",
      maxPrice: "110",
      lotSize: 120,
      issueSize: "445.60",
      status: "upcoming",
      rhpLink: "/rhp/jammu-textiles.pdf",
      description: "Jammu Textiles is a prominent textile manufacturer specializing in premium fabric production.",
      logoInitials: "JT",
      logoColor: "purple"
    }
  ];

  // Insert all demo IPOs
  await db.insert(ipos).values(demoIpos);
  
  console.log("Demo data seeded successfully!");
}