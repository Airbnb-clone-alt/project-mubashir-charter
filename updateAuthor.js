const mongoose = require('mongoose');
const Yacht = require('./models/yacht'); // Path adjust karo agar models ka path alag ho

async function makeMyselfAuthor() {
  try {
    // MongoDB connect
    await mongoose.connect('mongodb://localhost:27017/charterworks-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Database connected');

    // Tumhara user ID
    const myId = '685fa215bef954dd09bbeb7c';

    // Update all yachts author
    const result = await Yacht.updateMany({}, { author: myId });

    console.log(`✅ Updated ${result.modifiedCount} yachts — now all have your ID as author.`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    // Connection close
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

makeMyselfAuthor();
