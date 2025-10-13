import { UserService } from "../services/userService";

export async function createAdminUser() {
  console.log("🔐 Creating admin user...");
  
  try {
    const adminData = {
      name: "Admin User",
      email: "admin@hummusery.com",
      phone: "9999999999", // Default admin phone number
      password: "admin123", // Change this to a secure password
      role: "admin"
    };

    const existingAdmin = await UserService.findUserByEmail(adminData.email);
    
    if (existingAdmin) {
      console.log("⏭️  Admin user already exists with email:", adminData.email);
      return { created: false, message: "Admin user already exists" };
    }

    const adminUser = await UserService.createUser(adminData);
    
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("⚠️  Please change the password after first login!");
    
    return { 
      created: true, 
      user: adminUser,
      credentials: {
        email: adminData.email,
        password: adminData.password
      }
    };
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  }
}

// Run this script directly if called
if (require.main === module) {
  createAdminUser()
    .then((result) => {
      if (result.created) {
        console.log("✅ Admin user creation completed successfully");
      } else {
        console.log("ℹ️  Admin user already exists");
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Admin user creation failed:", error);
      process.exit(1);
    });
}