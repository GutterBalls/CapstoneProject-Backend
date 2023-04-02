const {
    createUser,
    createCategory,
    createProduct,
    createOrder,
    createItemsPurchased,
    createPayment,
    createCartItem
} = require('./')

const client = require('./client');

// Dropping tables, if they exist to repopulate with test data.
async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS cart_items;
            DROP TABLE IF EXISTS payment;
            DROP TABLE IF EXISTS items_purchased;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS product_category;
            DROP TABLE IF EXISTS users;
            `);
            console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; 
    };
};

// Creating tables in gutterBalls database.
async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
            CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            "isAdmin" BOOLEAN DEFAULT false
            );
            CREATE TABLE product_category(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
            );
            CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            image TEXT NOT NULL,
            brand VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price FLOAT NOT NULL,
            sale BOOLEAN DEFAULT false,
            clearance BOOLEAN DEFAULT false,
            category_id INTEGER REFERENCES product_category(id)
            );
            CREATE TABLE orders(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            order_date DATE,
            order_status VARCHAR(255) DEFAULT 'pending'
            );
            CREATE TABLE items_purchased(
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            order_id INTEGER REFERENCES orders(id),
            "purchasedPrice" FLOAT NOT NULL
            );
            CREATE TABLE payment(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            address VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            zip_code INTEGER NOT NULL
            );
            CREATE TABLE cart_items(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            order_id INTEGER REFERENCES orders(id),
            product_id INTEGER REFERENCES products(id),
            qty INTEGER NOT NULL,
            price FLOAT NOT NULL
            );

        `);
        console.log("Finished building tables!");

        } catch (error) {
            console.error("Error building tables!");
        throw error; 
    }
}

// Creating dummy data for users table.
async function createInitialUsers() {
    try {
        console.log("Starting to create users...");
        const dummyUsers = [
            { username: "albert", password: "bertie99", email: "albert@heyyyy.com", isAdmin: false },
            { username: "sandra", password: "sandra123", email: "sandy@thebest.com", isAdmin: false },
            { username: "glamgal", password: "glamgal123", email: "josh@glamorous.com", isAdmin: false },
            { username: "admin", password: "password", email: "admin@gutter-balls.com", isAdmin: true }
        ];
        const users = await Promise.all(dummyUsers.map(createUser));
    
        console.log("Users create:")
        console.log(users)
        console.log("Finished creating users!");

    } catch(error) {
        console.error("Error creating users!");
        throw error;
    };
};

// Creating dummy data for product_category table
async function createInitialCategory() {
    try {
        console.log("Starting to create product categories...");
        const dummyCategories = [
            "balls",
            "bags",
            "shoes",
            "accessories"
        ];
        console.log("createCategory", createCategory);
        const categories = await Promise.all(dummyCategories.map(createCategory));

        console.log("categories created:");
        console.log(categories)
        console.log("Finished creating categories!");

    } catch (error) {
        console.error("Error creating product category")
        throw error;
    };
};

// Creating dummy data for products table
async function createInitialProducts() {
    try {
        console.log("Starting to create products...");
        const dummyProducts = [
            { image: "/images/balls/Brunswick-HP-Defender.png", brand: "Brunswick", name: "Defender", description: "The new Defender Hybrid is the first ball introduced using HK22. You will first notice the shelf appeal and colors of the Defender Hybrid and how they pop; this is due to the new translucent base material. The new base material HK22 creates a noticeable and exciting advancement in shiny ball hook potential, creating more teeth in the mid-lane for a shiny ball and a stronger, more responsive breakpoint. The A.C.T. 3.0 additive package was added to the HK22 base to achieve optimal ball reaction. The Overall result is more backend and a shiny ball that will handle more volume and give the bowler more area at the breakpoint.", price: 184.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Brunswick-HP-Mindset.png", brand: "Brunswick", name: "Mindset", description: "Brunswick Mindset is the newest launch to bring perfect ball reaction on your bowling. Having a brand new core shape called Mindset, with dual flip blocks and large center mass the ball will give you a high performance. The ball give you a continuation of overall motion and recovery due to the new core shape. Brunswick Mindset also features DynamiCore and DOT technology making it more durable and strong at performance. The coverstock used for the ball is Evolution Reactive Solid. In a nutshell the ball will carry your clear mindset on pro performance bowling!", price: 184.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Brunswick-MP-Attitude.png", brand: "Bruswick", name: "Attitude", description: "Brunswick is bringing back more Attitude! The Brunswick Attitude Control has a urethane pearl coverstock paired with a versatile symmetric Contra core. This strong urethane cover and strong core result in a great urethane option for those with a lower rev rate and higher speed.", price: 139.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Brunswick-MP-Knock_Out.png", brand: "Bruswick", name: "Knock Out", description: "Brunswick is launching the Knock Out Bruiser to the Knock Out line. Buy one of the most reliable bowling ball of Knock Out series. With a Savvy Hook 4.0 Solid Coverstock and Melee core the ball offers plenty of hook, easy length and strong backend motion. The ball is appropriate for medium to heavy oil condition lane.", price: 154.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Brunswick-LP-Rhino.png", brand: "Bruswick", name: "Rhino", description: "The Brunswick Rhino Metallic Blue Black Pearl Bowling Ball is the perfect bowling ball for those looking at getting into their first reactive resin ball or for those looking for a ball for lighter to medium oil conditions. The perfect bowling ball for those looking at getting into their first reactive resin ball or for those looking for a ball for lighter to medium oil. Looking for an entry-level Rhino Metallic Blue Black Pearl Bowling Ball is not going to react strongly. Then look no further than the Brunswick Rhino bowling ball. This line of bowling balls balances power and control by pairing the R-16 reactive coverstock and a light bulb-shaped core.", price: 87.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Brunswick-LP-Twist.png", brand: "Bruswick", name: "Twist", description: "The Brunswick Twist Lavender Lime Bowling Ball is a great option for someone looking to take a step up from a plastic/spare ball. This ball combines the proven R-16 Reactive coverstock with the Twist Low Diff core. This balls proven cover and performance core combination at a new low price point will be an instant winner for newer bowlers and a great upgrade from plastic balls. The Brunswick Twist is a great option for someone looking to take a step up from a plastic spare ball. This combination allows for easy length while maintaining a strong and controllable backend reaction when up against drier lane conditions. The Twist line of bowling balls is great for any age or skill level.", price: 76.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/DV8-HP-Brutal_Collision.png", brand: "DV8", name: "Brutal Collision", description: "The Brutal Collision Bowling Ball is a fantastic follow-up of the DV8 Collision and uses an even stronger reacting cover base, HK22. Adding HK22 to the Collision core and a polished, solid cover creates even stronger hook and a devastating backend reaction. HK22 will create more color clarity, and the Brutal Collision is bold and vibrant. This ball will stand out for its look and also its performance on the lanes.", price: 184.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/DV8-HP-Hellcat.png", brand: "DV8", name: "Hellcat", description: "The new DV8 Hellcat carries on the performance of the Hell Raiser series by using the same core, but we’ve used a new cover formula to change the reaction. The core was paired with a super aggressive cover with the Hell Raiser Blaze and a skid flip cover with the Hell Raiser Return; the new Hellcat’s reaction fits right between those two balls. The new Havoc cover is a solid that produces less traction in the oil than a Blaze, conserving energy for the backend and making the Hellcat easy to choose from medium to heavy conditions.", price: 184.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/DV8-MP-Captiv8.png", brand: "DV8", name: "Captiv8", description: "DV8 is releasing the new Captiv8 Pearl Bowling Ball. The expected release of this mid performance ball is by February 2023. With an HK22 Inciter pearl cover the ball has a Captiv8 core to perform the best on medium to dry oil condition lane.", price: 129.99, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/DV8-MP-Diamond_Diva.png", brand: "DV8", name: "Diva", description: "The Diva is back and this time with diamonds! The DV8 Diamond Diva looks good and performs well and she knows it. This version of the bowling ball uses an updated Diva 2.0 core and the Inciter Max Flip Hybrid Reactive coverstock. The strong, glossy, hybrid coverstock along with a lower RG help to generate more midlane and backend reaction.", price: 144.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/DV8-LP-Scorcher_Spare.png", brand: "DV8", name: "Scorcher", description: "Your lanes will be on fire with the DV8 Scorcher Viz-A-Ball! This ball is perfect for blazing those 10 pins or if you need a straight ball. Watch out for the heat from the Scorcher!", price: 109.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/DV8-LP-Zombie_Spare.png", brand: "DV8", name: "Zombie", description: "Leave a few pins standing? Pull out your Zombie. Unlike the human undead this Zombie is easy to control. With trance like motion the Zombie heads straight towards any uncooperative pins and puts them down for good and when it's done it comes right back to you. How many other Zombies do you know that will do that?", price: 79.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Hammer-HP-Envy.png", brand: "Hammer", name: "Envy", description: "Hammer Envy was designed to be the strongest Hammer ball ever created. Started with the new asymmetric 'Launcher' core that is packed with impressive features. The Launcher core has both a flip block and our exclusive radial disc technology; these components move mass away from the center, creating an increased imbalance for a stronger reaction throughout the lane. For the cover, we went with the ultra-aggressive Envy Solid cover, found initially on the Obsession and ensuring plenty of hook in oil. Don't have ball envy", price: 189.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Hammer-HP-Envy_Tour.png", brand: "Hammer", name: "Envy Tour", description: "Hammer Envy Tour is the newest launch by Hammer in February with a solid reactive coverstock and an Obsession Tour core. The ball is an updated version of the most unique Obsession Tour by adding a stronger and responsive cover. Bowlers will enjoy a strong mid-lane reaction with a backend the recovery of the ball. It's one of the high performing bowling ball to be added into your arsenal.", price: 189.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Hammer-MP-Ocean_Vibe.png", brand: "Hammer", name: "Ocean Vibe", description: "Next to the Black Widow, the Vibe has been the most anticipated and requested ball to bring back. We spent a considerable amount of time on this Vibe to ensure it's the ball Hammer fans would love, and we're pretty sure we nailed it!", price: 119.99, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Hammer-MP-Scorpion_Sting.png", brand: "Hammer", name: "Scorpion", description: "Insects that kill also tend to strike; at least they do if they’re a Hammer ball. The Scorpion is the next must-have for Hammerheads. We started with the LED core that has made the urethane Hammers so successful and added an outer core, providing a medium RG and a high Differential. The Scorpion uses Symtex Hybrid to create a strong mid-lane and backend on medium conditions. Strong, predictable, deadly.", price: 124.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Hammer-LP-Black_Widow.png", brand: "Hammer", name: "Black Widow", description: "Hammer Black Widow is one of the most popular bowling line for Hammer. The first Hammer Black Widow released on 2020 and after that Hammer Black Widow Ghost dominated the people's choice. The new launch Hammer Black Widow 2.0 Hybrid is to take the bowling line further with innovation. The ball is featuring innovative HK22 base resin with the Aggression Hybrid Coverstock and a Gas Mask core to create more reaction to further downlane.", price: 149.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Hammer-LP-Raw_Hammer.png", brand: "Hammer", name: "Raw", description: "Hammer created the Raw series of bowling balls to enhance an experienced bowler's arsenal and to offer beginners a performance option for their first bowling ball. The Hammer Raw Pearl Blue/Silver/White features the Raw Hammer core which is covered with the Juiced Pearl coverstock then finished with a 500 then 1000 then 2000 grit Siaair sanding pad and finally polished with Crown Factory Polish. This combination of core, cover and finish gives this ball a skid/flip reaction and is ideal for light to medium oil.", price: 92.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Motiv-HP-Jackal.png", brand: "Motiv", name: "Jackal", description: "The Motiv Jackal Ambush bowling ball is the newest predator in the vicious Jackal line. With a brand new Leverage Solid Reactive coverstock and an asymmetric core the bowling ball offers strength and control of its environment. The ball provides high hook in oil with motion control providing a smooth and controlled roll even in the heaviest concentrations.", price: 214.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Motive-HP-Sky_Raptor.png", brand: "Motiv", name: "Sky Raptor", description: "The Sky Raptor™ brings the legendary Raptor™ line soaring back for worldwide release! Featuring the new Affliction™ V2 core and new Dynamic Infusion™ pearl reactive technology, the Sky Raptor™ is specifically designed to create down lane motion in heavy oil environments. You can have confidence that the Sky Raptor™ will clear the front of the lanes with ease and come screeching back with speed to attack the pocket", price: 214.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Motive-MP-Pride_Empire.png", brand: "Motiv", name: "Pride Empire", description: "The Motiv Pride Empire high-performance bowling ball introduces the Propulsion Pearl Reactive coverstock which offers more backend speed and angle. This coverstock gets through the front of the lane easily while maintaining energy for a unique down-lane reaction. Like the original Pride, the Pride Empire utilizes the Dominion core which is an asymmetric core but has the controllability of a symmetric core. This ball has an out-of-the-box 5000 Grit LSP finish which performs well on medium volumes of oil with a higher friction surface. This ball is a beast that demands respect!", price: 184.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Motive-MP-Ripcord_Launch.png", brand: "Motiv", name: "Ripcord Launch", description: "The Ripcord™ Launch Bowling Ball is a gorgeous pearl to nail the performance target perfectly. It's the first ball in the Ripcord™ series to utilize the incredibly strong Propulsion™ cover technology.  MOTIV® tuned it to get the length and response to friction needed, creating the new Propulsion MVP Pearl Reactive.  Utilizing this new cover, the Ripcord™ Launch handles the oil better than any previous Ripcord™ without sacrificing angularity. The special density-modified symmetrical Torx™ V2 has a super-compact design and fills an essential position in the line. With a moderate RG and differential the Ripcord™ Launch is a very powerful down-lane shape and impressive backend hitting bowling ball.", price: 184.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Motive-LP-Supra.png", brand: "Motiv", name: "Supra", description: "The new Supra Rally is one of the unique release to help you make your angular turns more precisely. It runs through the friction of the lane and navigate through hairpin turns magically. The ball is a best choice for the dry lane conditions. The ball comes with the new Quadfire V2 core combined with New Propulsion™ DRS Pearl Reactive cover which is considered the new DRS (Drag Reduction System) for more clean angular motion. Buy it if you need a ball that is the best combination of speed, power and precision of a high performance drift car.", price: 169.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Motive-LP-Top_Thrill.png", brand: "Motiv", name: "Top Thrill", description: "Motiv has taken the original Thrill up a notch and created the Top Thrill. This bowling ball was designed to offer length as well as control when the lane oil is light and there is a lot of friction. These balls feature the Halogen V2 weight block with a higher RG to delay the balls' reaction on the lane and generate the length required on lighter oil. The very low differential found in this ball helps minimize track flare and assists in ball motion control at the lane's backend. The coverstock used for the Motiv Thrill Pearl is the Turmoil XP Pearl Reactive and is finished with a 5500 Grit LSP. This ball is great for beginner bowlers as well as seasoned high rev bowlers looking for a good dry lane ball.", price: 129.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Storm-HP-DNA.png", brand: "Storm", name: "DNA", description: "Storm DNA comes with a Supercoil weight block that was intented for a super low RG shape with a greater undrilled intermediate differential. Which makes it a good Asymmatrical Core new launch bowling ball by Storm. The process of making the coverstock creates caverns of porosity and cliffs so deep which give this state-of-the-art shell.", price: 199.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Storm-HP-Fate.png", brand: "Storm", name: "Fate", description: "The Belmo story would not be the same if his path didn't cross with Storm. For over 20 years they have formed a formidable team. Winning titles globally as an amateur and then breaking records and setting the PBA Tour on fire together for over adecade. The partnership between Storm and Belmo was not luck, it was their FATE. For a ball to be emblazoned with Jason Belmonte's insignia, you know it must be special. After all, his 14 majors and multiple PBA Player of the Year accolades is no small feat. This man knows what he's talking about, so we've enlisted his help in designing some of the highest performing balls on the market, balls which reflect his career. Compared to the Dual-Drive™, Piston™, and Piston™ LD, the F-8 Core in the Fate has been packed with more differential than any previous Belmo ball before it. With those enhanced dynamics, the Fate gives the player more recovery and hitting power than any previous collaboration. This newly designed weight block was created to play multiple angles and have superior performance no matter your rev rate.", price: 194.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Storm-MP-Pitch_Black.png", brand: "Storm", name: "Pitch Black", description: "The storm has created the Black pitch, a solid ball of urethane, for their Thunder Line. This ball is designed to provide lighter and shorter control oil conditions. The Core Capacitor gives this ball a straight but strong delivery. Speaking of bowling in the desert, the Pitch Black is sure to satisfy even the thirstiest camel. Storm looked back to the proven technology of yesterday and developed a new spin on it with the porous and predictable new Control solid urethane coverstock.", price: 134.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Storm-MP-Revenant.png", brand: "Storm", name: "Revenant", description: "The Storm Revenant Bowling Ball comes following a tradition  and a promise to roll better than ever. The Vector Core in the Revenant bowling ball has some extra post-drilled asymmetry built into it if the pro shop chooses to utilize. The ball has a symmetric Vector core which is combined with R3S pearl reactive coverstock and finished with Reacta Gloss polish. The combination has an effect of increased reaction to the pins on a medium to heavy oil conditions.", price: 159.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Storm-LP-MIX.png", brand: "Storm", name: "Mix", description: "Storm is MIXing it up with the new Storm Mix. This ball is recommended for the bowler who needs a colorful spare ball. Since this is a urethane you may also prefer this ball as your strike ball since it works best on desert dry conditions. Mix things up a little and be the first to own the Storm Mix. The new Mix balls, available in two different colors, expand the Ice line with a new look and feel. The Mix, like the Polar Ice, features a durable U1S first generation urethane coverstock which is more controllable than U2S which powers the popular Natural series. The Mix traditional 3-piece core enhances predictability while the urethane coverstock ensures durability that other materials just cannot offer. And they are available in lighter weights. In addition to the standard 10-16 pound options, Storm is pleased to offer both 6 and 8 pound options as well.", price: 89.95, sale: false, clearance: false, category_id: 1 },
            { image: "/images/balls/Storm-LP-Tropical_Surge.png", brand: "Storm", name: "Tropical Surge", description: "The Storm Tropical bowling ball legacy continues with the Surge core making a great bowling ball for entry level and casual league bowlers. The bright fun colors and unique fragrances make these fun balls appealing to bowlers of every skill level. Each ball features the Reactor Pearl Reactive coverstock that glides through the front of the lane, reacts down-lane, and creates optimum pin carry. The Surge core has a higher differential which brings dependability and a little more hook at the backend.", price: 94.95, sale: false, clearance: false, category_id: 1 },
            
        ];

        const products = await Promise.all(dummyProducts.map((product) => createProduct(product)));

        console.log("products created:");
        console.log(products)
        console.log("Finished creating products!");

    } catch (error) {
        console.error("Error creating products");
        throw error;
    };
};

// Create dummy data for orders table
async function createInitialOrders() {
    try {
        console.log("Starting to create orders");
        const dummyOrders = [
            { user_id: 1, order_date: new Date, order_status: "pending"},
            { user_id: 2, order_date: new Date, order_status: "shipped"},
            { user_id: 3, order_date: new Date, order_status: "delivered"},
            { user_id: 1, order_date: new Date, order_status: "processing"}
        ];

        const orders = await Promise.all(dummyOrders.map(createOrder));

        console.log("orders created:");
        console.log(orders)
        console.log("Finished creating orders!");

    } catch (error) {
        console.error("Error creating orders");
        throw error;
    }
}

// Create dummy data for items_purchased table
async function createInitialItemsPurchased() {
    try {
        console.log("Starting to create ItemsPurchased");
        const dummyItemsPurchased = [
            { product_id: 1, order_id: 1, purchasedPrice: 167.95},
            { product_id: 2, order_id: 1, purchasedPrice: 149.95},
            { product_id: 3, order_id: 2, purchasedPrice: 79.95},
            { product_id: 4, order_id: 2, purchasedPrice: 279.95}
        ];


        const itemsPurchased = await Promise.all(dummyItemsPurchased.map(createItemsPurchased));

        console.log("ItemsPurchased created:");
        console.log(itemsPurchased)
        console.log("Finished creating ItemsPurchased!");

    } catch (error) {
        console.error("Error creating ItemsPurchased");
        throw error;
    }
}

// Create dummy data for payment table
async function createInitialPayment() {
    try {
        console.log("Starting to create Payment");
        const dummyPayment = [
            { user_id: 1, address: "2912 Overpriced St.", city: "Denver", state: "Colorado", zip_code: 11111},
            { user_id: 2, address: "5631 Yankee Dr.", city: "New York", state: "New York", zip_code: 22222},
            { user_id: 3, address: "1774 Hollywood Blvd.", city: "Los Angeles", state: "California", zip_code: 33333},
            { user_id: 4, address: "6142 Longhorn Ln.", city: "Houston", state: "Texas", zip_code: 44444}
        ];


        const payment = await Promise.all(dummyPayment.map(createPayment));

        console.log("Payment created:");
        console.log(payment)
        console.log("Finished creating Payment!");

    } catch (error) {
        console.error("Error creating Payment");
        throw error;
    }
}

// Create dummy data for cart_items table
async function createInitialCartItems() {
    try {
        console.log("Starting to create cart_items");
        const dummyCartItems = [
            { user_id: 1, order_id: 1, product_id: 1, qty: 1, price: 167.95},
            { user_id: 2, order_id: 2, product_id: 2, qty: 1, price: 149.95},
            { user_id: 3, order_id: 3, product_id: 3, qty: 1, price: 79.95},
            { user_id: 4, order_id: 4, product_id: 4, qty: 1, price: 279.95}
        ];

        const cartItem = await Promise.all(dummyCartItems.map(createCartItem));

        console.log("cartItem created:");
        console.log(cartItem)
        console.log("Finished creating cart_items!");

    } catch (error) {
        console.error("Error creating cart_items");
        throw error;
    }
}

async function rebuildDB() {
    try {
    client.connect();
    
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialCategory();
    await createInitialProducts();
    await createInitialOrders();
    await createInitialItemsPurchased();
    await createInitialPayment();
    await createInitialCartItems();

    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");


        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error during testDB!");
        throw error;
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());