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
            "isAdmin" BOOLEAN DEFAULT false,
            "isActive" BOOLEAN DEFAULT true
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
            price FLOAT,
            sale BOOLEAN DEFAULT false,
            clearance BOOLEAN DEFAULT false,
            category_id INTEGER REFERENCES product_category(id) ON DELETE CASCADE
            );
            CREATE TABLE orders(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            order_date DATE,
            order_status BOOLEAN DEFAULT false
            );
            CREATE TABLE payment(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            cardnum VARCHAR(255),
            exp VARCHAR(255),
            cvv VARCHAR(255),
            name VARCHAR(255),
            address VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            state VARCHAR(255) NOT NULL,
            zip_code VARCHAR(255) NOT NULL
            );
            CREATE TABLE cart_items(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            order_id INTEGER REFERENCES orders(id),
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            qty INTEGER NOT NULL,
            price FLOAT
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
            { username: "albert", password: "bertie99", email: "albert@heyyyy.com", isAdmin: false, isActive: true },
            { username: "sandra", password: "sandra123", email: "sandy@thebest.com", isAdmin: false, isActive: true },
            { username: "glamgal", password: "glamgal123", email: "josh@glamorous.com", isAdmin: false, isActive: true },
            { username: "admin", password: "password", email: "admin@gutter-balls.com", isAdmin: true, isActive: true }
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
    // BALLS------------------------------------------
            { image: "/images/balls/Brunswick-HP-Defender.png", brand: "Brunswick", name: "Defender", description: "The new Defender Hybrid is the first ball introduced using HK22. You will first notice the shelf appeal and colors of the Defender Hybrid and how they pop; this is due to the new translucent base material. The new base material HK22 creates a noticeable and exciting advancement in shiny ball hook potential, creating more teeth in the mid-lane for a shiny ball and a stronger, more responsive breakpoint. The A.C.T. 3.0 additive package was added to the HK22 base to achieve optimal ball reaction. The Overall result is more backend and a shiny ball that will handle more volume and give the bowler more area at the breakpoint.", price: 184.99, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Brunswick-HP-Mindset.png", brand: "Brunswick", name: "Mindset", description: "Brunswick Mindset is the newest launch to bring perfect ball reaction on your bowling. Having a brand new core shape called Mindset, with dual flip blocks and large center mass the ball will give you a high performance. The ball give you a continuation of overall motion and recovery due to the new core shape. Brunswick Mindset also features DynamiCore and DOT technology making it more durable and strong at performance. The coverstock used for the ball is Evolution Reactive Solid. In a nutshell the ball will carry your clear mindset on pro performance bowling!", price: 184.98, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Brunswick-MP-Attitude.png", brand: "Brunswick", name: "Attitude", description: "Brunswick is bringing back more Attitude! The Brunswick Attitude Control has a urethane pearl coverstock paired with a versatile symmetric Contra core. This strong urethane cover and strong core result in a great urethane option for those with a lower rev rate and higher speed.", price: 139.97, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Brunswick-MP-Knock_Out.png", brand: "Brunswick", name: "Knock Out", description: "Brunswick is launching the Knock Out Bruiser to the Knock Out line. Buy one of the most reliable bowling ball of Knock Out series. With a Savvy Hook 4.0 Solid Coverstock and Melee core the ball offers plenty of hook, easy length and strong backend motion. The ball is appropriate for medium to heavy oil condition lane.", price: 154.96, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Brunswick-LP-Rhino.png", brand: "Brunswick", name: "Rhino", description: "The Brunswick Rhino Metallic Blue Black Pearl Bowling Ball is the perfect bowling ball for those looking at getting into their first reactive resin ball or for those looking for a ball for lighter to medium oil conditions. The perfect bowling ball for those looking at getting into their first reactive resin ball or for those looking for a ball for lighter to medium oil. Looking for an entry-level Rhino Metallic Blue Black Pearl Bowling Ball is not going to react strongly. Then look no further than the Brunswick Rhino bowling ball. This line of bowling balls balances power and control by pairing the R-16 reactive coverstock and a light bulb-shaped core.", price: 87.95, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Brunswick-LP-Twist.png", brand: "Brunswick", name: "Twist", description: "The Brunswick Twist Lavender Lime Bowling Ball is a great option for someone looking to take a step up from a plastic/spare ball. This ball combines the proven R-16 Reactive coverstock with the Twist Low Diff core. This balls proven cover and performance core combination at a new low price point will be an instant winner for newer bowlers and a great upgrade from plastic balls. The Brunswick Twist is a great option for someone looking to take a step up from a plastic spare ball. This combination allows for easy length while maintaining a strong and controllable backend reaction when up against drier lane conditions. The Twist line of bowling balls is great for any age or skill level.", price: 76.94, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/DV8-HP-Brutal_Collision.png", brand: "DV8", name: "Brutal Collision", description: "The Brutal Collision Bowling Ball is a fantastic follow-up of the DV8 Collision and uses an even stronger reacting cover base, HK22. Adding HK22 to the Collision core and a polished, solid cover creates even stronger hook and a devastating backend reaction. HK22 will create more color clarity, and the Brutal Collision is bold and vibrant. This ball will stand out for its look and also its performance on the lanes.", price: 184.93, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/DV8-HP-Hellcat.png", brand: "DV8", name: "Hellcat", description: "The new DV8 Hellcat carries on the performance of the Hell Raiser series by using the same core, but we've used a new cover formula to change the reaction. The core was paired with a super aggressive cover with the Hell Raiser Blaze and a skid flip cover with the Hell Raiser Return; the new Hellcat's reaction fits right between those two balls. The new Havoc cover is a solid that produces less traction in the oil than a Blaze, conserving energy for the backend and making the Hellcat easy to choose from medium to heavy conditions.", price: 184.92, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/DV8-MP-Captiv8.png", brand: "DV8", name: "Captiv8", description: "DV8 is releasing the new Captiv8 Pearl Bowling Ball. The expected release of this mid performance ball is by February 2023. With an HK22 Inciter pearl cover the ball has a Captiv8 core to perform the best on medium to dry oil condition lane.", price: 129.91, sale: false, clearance: false, category_id: 1 },
            
            { image: "/images/balls/DV8-MP-Diamond_Diva.png", brand: "DV8", name: "Diva", description: "The Diva is back and this time with diamonds! The DV8 Diamond Diva looks good and performs well and she knows it. This version of the bowling ball uses an updated Diva 2.0 core and the Inciter Max Flip Hybrid Reactive coverstock. The strong, glossy, hybrid coverstock along with a lower RG help to generate more midlane and backend reaction.", price: 144.90, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/DV8-LP-Scorcher_Spare.png", brand: "DV8", name: "Scorcher", description: "Your lanes will be on fire with the DV8 Scorcher Viz-A-Ball! This ball is perfect for blazing those 10 pins or if you need a straight ball. Watch out for the heat from the Scorcher!", price: 109.89, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/DV8-LP-Zombie_Spare.png", brand: "DV8", name: "Zombie", description: "Leave a few pins standing? Pull out your Zombie. Unlike the human undead this Zombie is easy to control. With trance like motion the Zombie heads straight towards any uncooperative pins and puts them down for good and when it's done it comes right back to you. How many other Zombies do you know that will do that?", price: 79.88, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Hammer-HP-Envy.jpg", brand: "Hammer", name: "Envy", description: "Hammer Envy was designed to be the strongest Hammer ball ever created. Started with the new asymmetric 'Launcher' core that is packed with impressive features. The Launcher core has both a flip block and our exclusive radial disc technology; these components move mass away from the center, creating an increased imbalance for a stronger reaction throughout the lane. For the cover, we went with the ultra-aggressive Envy Solid cover, found initially on the Obsession and ensuring plenty of hook in oil. Don't have ball envy", price: 189.87, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Hammer-HP-Envy_Tour.jpg", brand: "Hammer", name: "Envy Tour", description: "Hammer Envy Tour is the newest launch by Hammer in February with a solid reactive coverstock and an Obsession Tour core. The ball is an updated version of the most unique Obsession Tour by adding a stronger and responsive cover. Bowlers will enjoy a strong mid-lane reaction with a backend the recovery of the ball. It's one of the high performing bowling ball to be added into your arsenal.", price: 189.86, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Hammer-MP-Ocean_Vibe.jpg", brand: "Hammer", name: "Ocean Vibe", description: "Next to the Black Widow, the Vibe has been the most anticipated and requested ball to bring back. We spent a considerable amount of time on this Vibe to ensure it's the ball Hammer fans would love, and we're pretty sure we nailed it!", price: 119.85, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Hammer-MP-Scorpion_Sting.jpg", brand: "Hammer", name: "Scorpion", description: "Insects that kill also tend to strike; at least they do if they’re a Hammer ball. The Scorpion is the next must-have for Hammerheads. We started with the LED core that has made the urethane Hammers so successful and added an outer core, providing a medium RG and a high Differential. The Scorpion uses Symtex Hybrid to create a strong mid-lane and backend on medium conditions. Strong, predictable, deadly.", price: 124.84, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Hammer-LP-Black_Widow.jpg", brand: "Hammer", name: "Black Widow", description: "Hammer Black Widow is one of the most popular bowling line for Hammer. The first Hammer Black Widow released on 2020 and after that Hammer Black Widow Ghost dominated the people's choice. The new launch Hammer Black Widow 2.0 Hybrid is to take the bowling line further with innovation. The ball is featuring innovative HK22 base resin with the Aggression Hybrid Coverstock and a Gas Mask core to create more reaction to further downlane.", price: 149.83, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Hammer-LP-Raw_Hammer.jpg", brand: "Hammer", name: "Raw", description: "Hammer created the Raw series of bowling balls to enhance an experienced bowler's arsenal and to offer beginners a performance option for their first bowling ball. The Hammer Raw Pearl Blue/Silver/White features the Raw Hammer core which is covered with the Juiced Pearl coverstock then finished with a 500 then 1000 then 2000 grit Siaair sanding pad and finally polished with Crown Factory Polish. This combination of core, cover and finish gives this ball a skid/flip reaction and is ideal for light to medium oil.", price: 92.82, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Motiv-HP-Jackal.png", brand: "Motiv", name: "Jackal", description: "The Motiv Jackal Ambush bowling ball is the newest predator in the vicious Jackal line. With a brand new Leverage Solid Reactive coverstock and an asymmetric core the bowling ball offers strength and control of its environment. The ball provides high hook in oil with motion control providing a smooth and controlled roll even in the heaviest concentrations.", price: 214.81, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Motive-HP-Sky_Raptor.png", brand: "Motiv", name: "Sky Raptor", description: "The Sky Raptor™ brings the legendary Raptor™ line soaring back for worldwide release! Featuring the new Affliction™ V2 core and new Dynamic Infusion™ pearl reactive technology, the Sky Raptor™ is specifically designed to create down lane motion in heavy oil environments. You can have confidence that the Sky Raptor™ will clear the front of the lanes with ease and come screeching back with speed to attack the pocket", price: 214.80, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Motive-MP-Pride_Empire.png", brand: "Motiv", name: "Pride Empire", description: "The Motiv Pride Empire high-performance bowling ball introduces the Propulsion Pearl Reactive coverstock which offers more backend speed and angle. This coverstock gets through the front of the lane easily while maintaining energy for a unique down-lane reaction. Like the original Pride, the Pride Empire utilizes the Dominion core which is an asymmetric core but has the controllability of a symmetric core. This ball has an out-of-the-box 5000 Grit LSP finish which performs well on medium volumes of oil with a higher friction surface. This ball is a beast that demands respect!", price: 184.79, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Motive-MP-Ripcord_Launch.png", brand: "Motiv", name: "Ripcord Launch", description: "The Ripcord™ Launch Bowling Ball is a gorgeous pearl to nail the performance target perfectly. It's the first ball in the Ripcord™ series to utilize the incredibly strong Propulsion™ cover technology.  MOTIV® tuned it to get the length and response to friction needed, creating the new Propulsion MVP Pearl Reactive.  Utilizing this new cover, the Ripcord™ Launch handles the oil better than any previous Ripcord™ without sacrificing angularity. The special density-modified symmetrical Torx™ V2 has a super-compact design and fills an essential position in the line. With a moderate RG and differential the Ripcord™ Launch is a very powerful down-lane shape and impressive backend hitting bowling ball.", price: 184.78, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Motive-LP-Supra.png", brand: "Motiv", name: "Supra", description: "The new Supra Rally is one of the unique release to help you make your angular turns more precisely. It runs through the friction of the lane and navigate through hairpin turns magically. The ball is a best choice for the dry lane conditions. The ball comes with the new Quadfire V2 core combined with New Propulsion™ DRS Pearl Reactive cover which is considered the new DRS (Drag Reduction System) for more clean angular motion. Buy it if you need a ball that is the best combination of speed, power and precision of a high performance drift car.", price: 169.77, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Motive-LP-Top_Thrill.png", brand: "Motiv", name: "Top Thrill", description: "Motiv has taken the original Thrill up a notch and created the Top Thrill. This bowling ball was designed to offer length as well as control when the lane oil is light and there is a lot of friction. These balls feature the Halogen V2 weight block with a higher RG to delay the balls' reaction on the lane and generate the length required on lighter oil. The very low differential found in this ball helps minimize track flare and assists in ball motion control at the lane's backend. The coverstock used for the Motiv Thrill Pearl is the Turmoil XP Pearl Reactive and is finished with a 5500 Grit LSP. This ball is great for beginner bowlers as well as seasoned high rev bowlers looking for a good dry lane ball.", price: 129.76, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Storm-HP-DNA.png", brand: "Storm", name: "DNA", description: "Storm DNA comes with a Supercoil weight block that was intented for a super low RG shape with a greater undrilled intermediate differential. Which makes it a good Asymmatrical Core new launch bowling ball by Storm. The process of making the coverstock creates caverns of porosity and cliffs so deep which give this state-of-the-art shell.", price: 199.75, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Storm-HP-Fate.png", brand: "Storm", name: "Fate", description: "The Belmo story would not be the same if his path didn't cross with Storm. For over 20 years they have formed a formidable team. Winning titles globally as an amateur and then breaking records and setting the PBA Tour on fire together for over adecade. The partnership between Storm and Belmo was not luck, it was their FATE. For a ball to be emblazoned with Jason Belmonte's insignia, you know it must be special. After all, his 14 majors and multiple PBA Player of the Year accolades is no small feat. This man knows what he's talking about, so we've enlisted his help in designing some of the highest performing balls on the market, balls which reflect his career. Compared to the Dual-Drive™, Piston™, and Piston™ LD, the F-8 Core in the Fate has been packed with more differential than any previous Belmo ball before it. With those enhanced dynamics, the Fate gives the player more recovery and hitting power than any previous collaboration. This newly designed weight block was created to play multiple angles and have superior performance no matter your rev rate.", price: 194.74, sale: false, clearance: false, category_id: 1 },
            
            { image: "/images/balls/Storm-MP-Pitch_Black.png", brand: "Storm", name: "Pitch Black", description: "The storm has created the Black pitch, a solid ball of urethane, for their Thunder Line. This ball is designed to provide lighter and shorter control oil conditions. The Core Capacitor gives this ball a straight but strong delivery. Speaking of bowling in the desert, the Pitch Black is sure to satisfy even the thirstiest camel. Storm looked back to the proven technology of yesterday and developed a new spin on it with the porous and predictable new Control solid urethane coverstock.", price: 134.73, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Storm-MP-Revenant.png", brand: "Storm", name: "Revenant", description: "The Storm Revenant Bowling Ball comes following a tradition  and a promise to roll better than ever. The Vector Core in the Revenant bowling ball has some extra post-drilled asymmetry built into it if the pro shop chooses to utilize. The ball has a symmetric Vector core which is combined with R3S pearl reactive coverstock and finished with Reacta Gloss polish. The combination has an effect of increased reaction to the pins on a medium to heavy oil conditions.", price: 159.72, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Storm-LP-MIX.png", brand: "Storm", name: "Mix", description: "Storm is MIXing it up with the new Storm Mix. This ball is recommended for the bowler who needs a colorful spare ball. Since this is a urethane you may also prefer this ball as your strike ball since it works best on desert dry conditions. Mix things up a little and be the first to own the Storm Mix. The new Mix balls, available in two different colors, expand the Ice line with a new look and feel. The Mix, like the Polar Ice, features a durable U1S first generation urethane coverstock which is more controllable than U2S which powers the popular Natural series. The Mix traditional 3-piece core enhances predictability while the urethane coverstock ensures durability that other materials just cannot offer. And they are available in lighter weights. In addition to the standard 10-16 pound options, Storm is pleased to offer both 6 and 8 pound options as well.", price: 89.71, sale: false, clearance: false, category_id: 1 },

            { image: "/images/balls/Storm-LP-Tropical_Surge.png", brand: "Storm", name: "Tropical Surge", description: "The Storm Tropical bowling ball legacy continues with the Surge core making a great bowling ball for entry level and casual league bowlers. The bright fun colors and unique fragrances make these fun balls appealing to bowlers of every skill level. Each ball features the Reactor Pearl Reactive coverstock that glides through the front of the lane, reacts down-lane, and creates optimum pin carry. The Surge core has a higher differential which brings dependability and a little more hook at the backend.", price: 94.70, sale: false, clearance: false, category_id: 1 },

    // BAGS-------------------------------------------
            { image: "/images/bags/brunswick-tzone-1-tote-lime.jpg", brand: "Brunswick", name: "T-Zone", description: "When you order the Brunswick T-Zone Bowling Bag, you know you are getting a high quality bowling ball bag at a cheap price. This bag holds one ball plus bowling shoes, so you know that you will have the basics covered. It's tough, made with 600 D material, and covered by a two year warranty. This is just an excellent bag overall. 1 (one) ball tote lime green black.", price: 28.69, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/brunswick-edge-1-wht.jpg", brand: "Brunswick", name: "Edge", description: "The Brunswick Edge Single Roller is perfect for those that are on the go all the time. This roller features a large zippered pocket to store your bowling accessories and it has a shoe compartment that stores shoes up to a size 12. Brunswick offers a 5 year limited manufacturer's warranty. 1 (one) ball roller black white.", price: 84.68, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/brunswick-quest-2-blkblu.jpg", brand: "Brunswick", name: "Quest", description: "The Brunswick Quest Double Roller has the best in class base with flush retractable handle system. This roller offers plenty of storage space for all of your bowling accessories. This roller also features a full length shoe compartment. 2 (two) ball roller black blue lime green.", price: 159.67, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/brunswick-blitz-3-org.jpg", brand: "Brunswick", name: "Blitz", description: "The Brunswick Blitz Triple Roller has the best in class base with flush retractable handle system. This roller offers plenty of storage space for all of your bowling accessories. This roller also features a full length shoe compartment. 3 (three) ball roller black orange.", price: 159.66, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/elite-impression-1-tote-gry.jpg", brand: "Elite", name: "Impression", description: "The Elite Impression Silver Bowling Bag is a great piece of bowling equipment.  It utilizes advanced technology, like durable 600 Denier material and steel hardware, to provide durability you can rely on.  In fact, it even comes with a one year complete warranty.  It can hold a bowling ball, bowling shoes, plus any accessories you may need to bowl your very best.  Now this spectacular bag is available at an impressively low price. 1 (one) ball tote silver (gray) black.", price: 21.65, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/elite-basic-1-red.jpg", brand: "Elite", name: "Basic", description: "The Elite Basic Single Roller in Red has a simple design paired with great craftsmanship which equals a fantastic bag.  A sturdy base holds 1 bowling ball securely in place during transportation.  Fit up to a size 10.5 shoe in the shoe compartment as well as many of the accessories you need when heading to bowl.  Pair a sleek, compact bag with great wheels and a retractable handle and you have the perfect bag for your bowling needs. 1 (one) ball roller black red.", price: 67.64, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/elite-basic-2-vio.jpg", brand: "Elite", name: "Basic", description: "The Elite Basic Double Roller in Purple has a simple design paired with great craftsmanship which equals a fantastic bag.  A sturdy base holds 2 bowling balls securely in place during transportation.  Fit up to a size 15 shoe in the roomy shoe compartment as well as many of the accessories you need when heading to bowl.  Pair a sleek, compact bag with great wheels and a retractable handle and you have the perfect bag for your bowling needs. 2 (two) ball roller black purple (violet).", price: 79.63, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/elite-hero-4-blu.jpg", brand: "Elite", name: "4 Ball", description: "The ELITE 4-Ball Bowling Roller bag is a premium bag with room to store four bowling balls, shoes and all the accessories you will ever need. The awesome removable top bag converts to a full functioning 2 ball premium tote! With the 5-inch smooth urethane wheels, you will have the most stable ride in the bowling industry! 4 (four) ball roller black blue.", price: 259.62, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/storm-solo-1-pnk.jpg", brand: "Storm", name: "Solo", description: "The Storm 1 Ball Solo Black and Pink Bowling Bag is a cool bowling ball bag that looks amazing. This bag can contain your bowling ball, bowling shoes, and any other equipment you may want to bring to help you achieve your personal best. And you can rest assured that this bag will hold up to some hard use. It's made with 600 Denier polyvinyl and reinforced stitching. It's also covered by a one year limited warranty. Additionally, this bag's sharp colors and embroidered logos make it one of the most eye-catching bowling bags available. 1 (one) ball tote pink black.", price: 32.61, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/storm-rascal-1-blkgry.jpg", brand: "Storm", name: "Rascal", description: "Purchase the Storm Rascal 1 Ball Roller Black Bowling Bag and enjoy the many features of this excellent single bowling ball bag. It holds a ball plus bowling shoes and other gear. The 600 D material and reinforced stitching make it very sturdy bag, and it is also covered by a 90 day limited warranty. It includes a retractable handle, hefty rubber wheels, and a protective foam base. It's a stylish, attractive bag that will hold up well to some serious use. 1 (one) ball roller black gray", price: 72.60, sale: false, clearance: false, category_id: 2 },

            { image: "images/bags/storm-rolling_thunder-2-whtplat.jpg", brand: "Storm", name: "Rolling Thunder", description: "The Storm Rolling Thunder Signature 2 ball roller is designed to look sleek, yet feel powerful. The bag features quality construction for the ultimate rolling experience. 2 (two) ball roller white platinum", price: 179.59, sale: false, clearance: false, category_id: 2 },

            { image: "/images/bags/storm-rolling_thunder-3-whtplat.jpg", brand: "Storm", name: "Rolling Thunder", description: "Storm has taken their proven high performance 3 ball roller and upgraded the materials to achieve prestige and durability. The Storm Rolling Thunder 3 Ball Roller Signature bag holds nothing back in the style department. This bag has all the high tech features of the Rolling Thunder bags but Storm takes it up a notch in the materials used for this signature bag. 3 (three) ball roller white platinum.", price: 239.58, sale: false, clearance: false, category_id: 2 },

    // SHOES--------------------------------------------
            { image: "/images/shoes/dexter-c9-m.jpg", brand: "Dexter", name: "C-9 Laser", description: "Dexter's THE C-9 Lazer BOA brings you all of the patented Toehold Hyperflex Engineering and fully loaded technology of our traditional T H E 9 with a new Cloud9 energy return midsole to keep your feet feeling great. The breathable laser cut leather upper helps to keep you cool and comfortable. It's designed with the BOA Fit System with disc lacing for instant adjustability you can customize for your perfect fit and comfort level. Black", price: 259.57, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/dexter-groovy-w.jpg", brand: "Dexter", name: "Groovy", description: "Make a statement on the lanes with the Dexter Ultra Groovy Blue Bowling Shoes! The Groovy Blue Abstract design is super fun and even glows in black light! These shoes are designed for ultra comfort too! Rainbow swirl", price: 64.56, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/dexter-harper-w.jpg", brand: "Dexter", name: "Harper", description: "The Dexter Womens Harper is part of Dexter's Comfort Casuals Collection. This shoe has a lightweight and breathable design due to the knit fabric upper material. The blending of purple, pink, and blue colors makes this shoe stand out. The padded heel collar, padded tongue, and side vents help make this shoe comfortable. Purple (violet)", price: 89.55, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/dexter-sst-8-pro-m.jpg", brand: "Dexter", name: "SST8", description: "The Dexter Mens SST 8 Pro bowling shoe takes a classic look and pairs it with modern technology. This shoe features Dexter's total interchangeable sole construction which makes this shoe convertible for left hand or right hand bowlers and allows the bowler to customize their slide surface as well as their traction surface. This shoe is where comfort and performance and now retro styling come together to make one great shoe! Black blue", price: 159.54, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/dexter-sst8-pwr-m.jpg", brand: "Dexter", name: "SST 8 Power", description: "Dexter's famous SST 8 innovation comes to you in the SST 8 Power Frame BOA. These shoes feature our new Power Frame KPU overmold in a textured honeycomb cell pattern to reinforce the fabric of the shoe for longer life. The BOAFit System with disc lacing gives you instant adjustability and convenience. White", price: 219.53, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/dexter-the-9-m.jpg", brand: "Dexter", name: "The 9", description: "Dexter THE 9 takes bowling shoes to a whole new level. THE stands for Toehold Hyperflex Engineering which increases the flexibility and durability of the shoe. THE 9 HT is the newest in the shoe series, with a list of high performance features. This shoe has a lot to offer, starting at the toe and going all the way to the heel. Rainbow", price: 244.52, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/elite-classic-w.jpg", brand: "Elite", name: "Classic", description: "ELITE introduces this new vibrant and comfortable shoe, the ELITE Classic! Have fun bowling in these women's bowling shoes that sure will be a hit on your next trip to the lanes. Super lightweight and comfortable and come backed by our 1 year warranty! Purple / violet", price: 39.51, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/kr-strikeforce-commander-m.jpg", brand: "KR Strikeforce", name: "Commander", description: "A new soft, lightweight, breathable knitted one piece upper makes the KR Strikeforce Men's Commander Bowling Shoe  has style and performance. These shoes are crafted for comfort with an open-cell foam deluxe footbed and a new Bubble Rubber CMEVA outsole. With the FlexSlide technology and microfiber slide pad, you'll have a smooth playing experience and bowl strike after strike.  Great for right or left handed bowlers.Charcoal gray", price: 72.50, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/kr-strikeforce-flair-w.jpg", brand: "KR Strikeforce", name: "Flair", description: "With both excellent style and lightweight two tone mesh upper the KR Strikeforce Women's Flair Bowling Shoes fulfill everything you need to perfect your approach and beat your opponent. The shoes feature a lace up design with Komfort Fit construction and Bubble Rubber CMEVA outsole with raised rubber heel pad.  Comes with a #8 white microfiber slide pad on both shoes with FlexSlide Technology makes it great for right or left handed bowliers.  The open cell foam deluxe footbed gives the Flair maximum comfort. Pink black", price: 69.49, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/kr-strikeforce-maverick-m-.jpg", brand: "KR Strikeforce", name: "Mavrick", description: "Strikeforce High Performance Maverick FT comes with a twist.  Super light, breathable, welded mesh upper with TPU saddle for an enhanced fit and increased stability.  Comes with a Fast Twist lacing system. Black gray blue", price: 219.48, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/kr-strikeforce-nova-m.jpg", brand: "KR Strikeforce", name: "Nova", description: "Strikeforce High Performance Maverick FT comes with a twist. Super light, breathable, welded mesh upper with TPU saddle for an enhanced fit and increased stability. Comes with a Fast Twist lacing system. Heather gray pink", price: 62.47, sale: false, clearance: false, category_id: 3 },

            { image: "/images/shoes/motive-propel-m.jpg", brand: "Motiv", name: "Propel", description: "Motiv introduces their first line of bowling shoes and has pulled out all the stops to provide you premium performance as well as comfort and durability! The Motiv Mens Propel shoe is engineered with biomechanical contouring to accomodate the natural curved, asymmetrical design of the foot and an angled flex zone. The Propel shoe features a customizable slide with interchangeable slide soles and heels, classic design and durable construction, maximum comfort and breathability, and is backed by a 2-Year manufacturer's warranty. Also, The new White/Carbon/Lime Propel HP shoes feature the popular FastTwist (FT) FreeLock lacing system. White lime green", price: 219.46, sale: false, clearance: false, category_id: 3 },

    // ACCESSORIES-------------------------------------------
            { image: "/images/accessories/genesis-excel-bowling-tape.jpg", brand: "Genesis", name: "Excel Performance Tape", description: "Don't know which tape is best for you? Try out this sample pack that includes pre-cut pieces of all of them! 10 total pieces: (2) Excel 1 Red: Fastest release, (2) Excel 2 Blue: Med-fast release, (2) Excel 3 Purple: Medium release, (2) Excel 4 Orange: Med-slow release,(2) Excel 5 Aqua: Slowest release.", price: 9.45, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/genesis-sync-bowling-tape.jpg", brand: "Genisis", name: "Sync Silver Bowling Tape", description: "The Genesis Sync Silver tape is an all new hybrid of traditional style bowling tape.It is made of semi-transparent 10 mil soft vinyl that combines enhanced grip with a smooth surface, to resist wear of the tape. The soft feel gives a comfortable grip, helping to eliminate added tension in your grip. This is a great addition to any bowler's bag!", price: 9.44, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/kr-strikeforce-pure_energy-ball-cleaner.jpg", brand: "KR Strikeforce", name: "Pure Energy Bowling Ball Cleaner", description: "Strikeforce Pure Energy bowling ball cleaner is perfect for removing dirt and oil from your bowling balls, plus restores that tacky surface for more backend hook.", price: 12.43, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/vise-ball-polish-cleaner.jpg", brand: "Vise", name: "Ball Cleaner & Polish", description: "Vise Ball Polish is safe to handle and safe for all cover-stock types of bowling balls. Vise Ball Polish was introduced in 2014 and has quickly found it's way into the finest pro shops and the lockers of the world's best bowlers.", price: 19.42, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/kr-strikeforce-pro-force-glove.jpg", brand: "KR Strikeforce", name: "Pro Force Positioner Glove", description: "KR Strikeforce Pro Force Glove combines support and comfort with durability and style. It is all about giving the bowler control and having a more consistent release. Supple top graded leather for durability. Spandex finger gusserts and back stretch for the perfect fit and breathability. Heavy duty gripping compound to increase contact with ball for added control", price: 24.41, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/brunswick-bionic-positioner.jpg", brand: "Brunswick", name: "Bionic Positioner XF Bowling Glove", description: "The Brunswick Bionic Wrist Positioner XF offers several wrist cup and lateral positions to best suit your game. The extended index finger provides additional rotation potential. This positioner is is made of durable aluminum materials that make it lightweight and comfortable.", price: 56.40, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/brunswick-grip-ball.jpg", brand: "Brunswick", name: "Dye Sub Grip Ball", description: "Get the Dye Sub Grip Ball today with this bright new blue color! Round, easy to hold shape. Microfiber material absorbs moisture", price: 12.39, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/storm-shoe-cover.jpg", brand: "Storm", name: "Bowling Shoe Cover", description: "With the Storm Men's Shoe Cover you can keep your shoes clean and dry between frames. Easy to slip on and protect the bottoms of your shoes from water, gum or maybe someone's left over french fry. Have a clean, smooth approach every time you're up by protecting your shoes!", price: 9.38, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/hammer-see-saw.jpg", brand: "Hammer", name: "See Saw Diamond Plate", description: "The Hammer See-Saw provides the ultimate cleaning power with a large cleaning surface. This stylish See-Saw also protects your bowling ball during storage while in a bag or locker.", price: 16.37, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/bbf-shammy-pad.jpg", brand: "BowlingBallFactory.com", name: "Ultra Tac Leather Shammy Pad", description: "Bowlingballfactory.com's Ultra Tac Shammy Pad works best in removing oil from your bowling ball. The Quality leather material on both sides restores the tackiness to the bowling ball that creates a strong backend motion. This pad can be used on all types of bowling balls so step up and get one!", price: 9.36, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/brunswick-ball-display-cup.jpg", brand: "Brunswick", name: "Rotating Ball Display Cup", description: "Brunswick is happy to give you a product that will help you more easily and evenly clean, polish, or sand your bowling ball. Whether at the big tournament or at your local lanes, take this rotating ball cup with you to make sure you're at the top of your game!", price: 18.35, sale: false, clearance: false, category_id: 4 },

            { image: "/images/accessories/kr-strikeforce-ball-sanding-pad.jpg", brand: "KR Strikeforce", name: "Abralon Bowling Ball Sanding Pad", description: "Do you need to sand your ball down to a different finish? If so this could be the perfect sanding pad for you. It can be used wet, or dry. It works great with Powerhouse Ball Resurface. This sanding pad will last 5 times longer than sandpaper.", price: 7.34, sale: false, clearance: false, category_id: 4 },   
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
            { user_id: 1, order_date: new Date },
            { user_id: 2, order_date: new Date },
            { user_id: 3, order_date: new Date },
            { user_id: 4, order_date: new Date }
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
            { user_id: 1, cardnum: 4444111199992222, exp: 1226, cvv: 499, name: "User1name", address: "2912 Overpriced St.", city: "Denver", state: "CO", zip_code: 11111},
            { user_id: 2, cardnum: 2222321065409870, exp: 0124, cvv: 223, name: "User2name", address: "5631 Yankee Dr.", city: "New York", state: "NY", zip_code: 22222},
            { user_id: 3, cardnum: 5555000055550000, exp: 0923, cvv: 355, name: "User3name", address: "1774 Hollywood Blvd.", city: "Los Angeles", state: "CA", zip_code: 33333},
            { user_id: 4, cardnum: 333312345678910, exp: 0124, cvv: 123, name: "User4name", address: "6142 Longhorn Ln.", city: "Houston", state: "TX", zip_code: 44444}
        ];


        const payment = await Promise.all(dummyPayment.map(createPayment));

        console.log("Payment created:");
        console.log(payment)
        console.log("Finished creating Payment!");

    } catch (error) {
        console.error("Error w/ seed createInitialPayment");
        throw error;
    }
}

// Create dummy data for cart_items table
async function createInitialCartItems() {
    try {
        console.log("Starting to create cart_items");
        const dummyCartItems = [
            { user_id:1, order_id: 1, product_id: 1, qty: 1},
            { user_id:2, order_id: 2, product_id: 2, qty: 1},
            { user_id:3, order_id: 3, product_id: 3, qty: 1},
            { user_id:4, order_id: 4, product_id: 4, qty: 1}
        ];

        const cartItem = await Promise.all(dummyCartItems.map(createCartItem));

        console.log("cartItem created:");
        console.log(cartItem)
        console.log("Finished creating cart_items!");

    } catch (error) {
        console.error("Error w/ createInitialCartItems func");
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
    // await createInitialItemsPurchased();
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