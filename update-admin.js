const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Your specific connection string
const mongoUri = "mongodb+srv://agentrollandkyle_db_user:Rollandklye00@cluster0.3g0dwrb.mongodb.net/acl_fund?retryWrites=true&w=majority&appName=Cluster0";

async function runUpdate() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(mongoUri);
        console.log("✅ Connected!");

        const newPassword = "Rolland2026"; // <--- CHANGE THIS TO YOUR NEW PASSWORD
        const emailToUpdate = "agentrollandkyle@gmail.com";     // <--- CHANGE THIS TO YOUR ADMIN EMAIL

        // We hash it manually because we are interacting with the DB directly
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Access the collection directly to avoid schema issues
        const result = await mongoose.connection.db.collection('adminusers').updateOne(
            { email: emailToUpdate.toLowerCase() },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount > 0) {
            console.log(`✅ Success! Password updated for: ${emailToUpdate}`);
        } else {
            console.log("❌ Error: No admin found with that email. Check your email address.");
            
            // Helpful: List all emails in that collection so you can see the right one
            const users = await mongoose.connection.db.collection('adminusers').find().toArray();
            console.log("Current admins in database:", users.map(u => u.email));
        }

    } catch (err) {
        console.error("❌ Critical Error:", err.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

runUpdate();