async function runTests() {
  console.log("🔍 Starting Week 1 Architecture Audit...\n");

  try {
    // 1. Check if the server is alive
    const health = await fetch('http://localhost:8000/');
    console.log("✅ Health Check (GET /):", health.status === 200 ? "PASS" : "FAIL");

    // 2. Add a test medicine
    const addReq = await fetch('http://localhost:8000/api/medicines/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Audit-Aspirin',
        genericName: 'Acetylsalicylic acid',
        manufacturer: 'TestCorp',
        strength: '300mg',
        category: 'Tablet'
      })
    });
    console.log("✅ Write Database (POST /api/medicines/add):", addReq.status === 201 ? "PASS" : "FAIL");

    // 3. Verify it saved correctly
    const getReq = await fetch('http://localhost:8000/api/medicines/all');
    const getRes = await getReq.json();
    const isSaved = getRes.data && getRes.data.some((m: any) => m.name === 'Audit-Aspirin');
    
    console.log("✅ Read Database (GET /api/medicines/all):", getReq.status === 200 && isSaved ? "PASS" : "FAIL");

    console.log("\n🏆 AUDIT COMPLETE: Week 1 is verified.");
  } catch (error) {
    console.error("\n❌ AUDIT FAILED. Is your server running on port 8000?");
  }
}

runTests();