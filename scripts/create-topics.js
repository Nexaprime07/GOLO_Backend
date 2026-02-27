const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'topic-creator',
  brokers: ['localhost:9092']
});

const topics = [
  // Command topics
  'ad.create',
  'ad.update',
  'ad.delete',
  'ad.get',
  'ad.get.by.category',
  'ad.get.by.user',
  'ad.search',
  'ad.get.nearby',
  
  // Event topics
  'ad.created',
  'ad.updated',
  'ad.deleted',
  'ad.viewed',
  'ad.expired',
  'ad.promoted',
  
  // Response topics
  'ad.response',
  'ad.error',
  
  // Dead Letter Queue
  'ad.dlq'
];

async function createTopics() {
  const admin = kafka.admin();
  
  try {
    await admin.connect();
    console.log('✅ Connected to Kafka');
    
    const existingTopics = await admin.listTopics();
    console.log('Existing topics:', existingTopics);
    
    for (const topic of topics) {
      if (!existingTopics.includes(topic)) {
        await admin.createTopics({
          topics: [{
            topic,
            numPartitions: 3,
            replicationFactor: 1
          }]
        });
        console.log(`✅ Created topic: ${topic}`);
      } else {
        console.log(`⏭️ Topic already exists: ${topic}`);
      }
    }
    
    console.log('\n✅ All topics created successfully!');
    
    // Verify topics were created
    const finalTopics = await admin.listTopics();
    console.log('\n📋 Final topics list:', finalTopics);
    
  } catch (error) {
    console.error('❌ Error creating topics:', error);
  } finally {
    await admin.disconnect();
    console.log('👋 Disconnected from Kafka');
  }
}

// Run the script
createTopics().catch(console.error);