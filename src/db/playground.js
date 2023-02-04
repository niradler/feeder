
const client = require('./client')

async function main() {
    await client.alert.create({
        data: {
            title: "My Title"
        },
    });

    console.log("New alert:");
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await client.$disconnect();
    });