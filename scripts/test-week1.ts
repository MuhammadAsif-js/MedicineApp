async function runAudit() {
    console.log("Starting backend infrastructure audit...\n");
    const baseUrl = "http://localhost:8000";

    // 1. Check the health route
    console.log("1. Checking health route GET /...");
    try {
        const healthRes = await fetch(`${baseUrl}/`);
        if (healthRes.ok) {
            console.log("✅ Health route GET / is working.");
        } else {
            console.error(`❌ Health route GET / returned status ${healthRes.status}.`);
        }
    } catch (error: any) {
        console.error("❌ Failed to reach health route GET /:", error.message);
    }

    // 2. Send a POST request to /api/medicines/add
    console.log("\n2. Sending POST request to /api/medicines/add...");
    try {
        const dummyData = {
            name: "Aspirin",
            description: "Pain reliever",
            price: 5.99,
            stock: 100
        };
        const addRes = await fetch(`${baseUrl}/api/medicines/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dummyData)
        });

        if (addRes.ok) {
            console.log("✅ Successfully added medicine.");
            const responseData = await addRes.json();
            console.log("Response:", responseData);
        } else {
            console.error(`❌ Failed to add medicine, status ${addRes.status}.`);
            const errText = await addRes.text();
            console.error("Error details:", errText);
        }
    } catch (error: any) {
        console.error("❌ Failed to reach POST /api/medicines/add:", error.message);
    }

    // 3. Send a GET request to /api/medicines/all
    console.log("\n3. Sending GET request to /api/medicines/all...");
    try {
        const getRes = await fetch(`${baseUrl}/api/medicines/all`);
        if (getRes.ok) {
            console.log("✅ Successfully fetched medicines.");
            const data: any = await getRes.json();

            // Check if Aspirin is in the array. Assuming data is an array or data.data is an array based on standard response formats
            let medicinesArray = [];
            if (Array.isArray(data)) {
                medicinesArray = data;
            } else if (data.data && Array.isArray(data.data)) {
                medicinesArray = data.data;
            }

            const found = medicinesArray.find((med: any) => med.name === "Aspirin");
            if (found) {
                console.log("✅ Aspirin found in the medicines array.");
            } else {
                console.error("❌ Aspirin not found in the medicines array.");
            }
        } else {
            console.error(`❌ Failed to fetch medicines, status ${getRes.status}.`);
            const errText = await getRes.text();
            console.error("Error details:", errText);
        }
    } catch (error: any) {
        console.error("❌ Failed to reach GET /api/medicines/all:", error.message);
    }

    console.log("\nAudit complete.");
}

runAudit();