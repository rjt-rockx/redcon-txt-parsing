import fs from "node:fs";

const parseAchievements = () => {
  const data = fs.readFileSync("./input/Achievements.txt");

  const parsed = data
    .toString()
    .split("\n\n")
    .map((v) =>
      v
        .split("\n")
        .map((t) => t.trim())
        .filter((r) => !!r)
    )
    .map((values) => {
      const counts = values[2].split("+");
      return {
        name: values[0],
        description: values[1],
        credits: +counts[1].split(" ")[0],
        experience: +counts[2].split(" ")[0],
        perkDropChance: +counts[3].split(" ")[0].split("%")[0],
      };
    });

  fs.writeFileSync(
    "./output/achievements.json",
    JSON.stringify(parsed, null, 4)
  );
};

const parsePerks = () => {
  const data = fs.readFileSync("./input/Perks.txt");

  const parsed = data
    .toString()
    .split("\n\n")
    .map((v) => {
      const [name, ...values] = v
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => !!t);
      return values.map((value, index) => ({
        name: name.trim(),
        description: value.trim(),
        tier: +index + 1,
      }));
    })
    .flat(2);

  fs.writeFileSync("./output/perks.json", JSON.stringify(parsed, null, 4));
};

const parseUtilities = () => {
  const data = fs.readFileSync("./input/utilities.txt");

  const parsed = data
    .toString()
    .split("\n\n\n")
    .map((entries) => {
      const items = entries.split("\n\n");
      const newItems = items.map((entry, index) => {
        const [name, ...description] = entry.split("\n");
        let descriptionText = description.join("\n");
        // if (index > 0) {
        //   for (let i = 0; i < index; i++) {
        //     const [itemName, ...itemDescription] = items[i].split("\n");
        //     const itemDescriptionText = itemDescription.join("\n");
        //     descriptionText =
        //       itemDescriptionText.trim() + "\n\n" + descriptionText.trim();
        //   }
        // }
        return {
          name: name.trim(),
          description: descriptionText.trim(),
          tier: index + 1,
        };
      });
      return {
        name: newItems[0].name,
        tiers: newItems,
      };
    });

  fs.writeFileSync("./output/utilities.json", JSON.stringify(parsed, null, 4));
};

const parseForts = () => {
  const data = fs.readFileSync("./input/forts.txt");

  const parsed = data
    .toString()
    .split("\n\n")
    .map((group) => {
      const [category, ...items] = group.split("\n");
      return items
        .filter((item) => !!item)
        .map((item) => {
          let [progress, name] = item.split("% - ");
          let description = "";
          if (name.includes(":")) [name, description] = name.split(":");
          return {
            name: name.trim(),
            category: category.trim(),
            progress: +progress,
            description: description.trim(),
          };
        });
    })
    .flat(3)
    .sort((a, b) => a.progress - b.progress);

  fs.writeFileSync("./output/forts.json", JSON.stringify(parsed, null, 4));
};

parseAchievements();
parsePerks();
parseUtilities();
parseForts();
