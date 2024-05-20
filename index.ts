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

const slugify = (text: string) => {
  let newText = text.toLowerCase();

  // remove all punctuation except hyphens
  newText = newText.replace(/[^a-zA-Z0-9 \-]/g, "");

  return newText.replace(/\s/g, "-").replace(/--/g, "-").replace(/-$/g, "");
};

const parseFortImages = () => {
  const slugs = fs
    .readFileSync("./input/enemy-fort-filenames.txt")
    .toString()
    .split("\n")
    .filter((slug) => !!slug);
  const urls = fs
    .readFileSync("./input/enemy-fort-image-urls.txt")
    .toString()
    .split("\n")
    .filter((url) => !!url);
  return slugs.map((slug, index) => ({
    slug,
    url: urls[index],
  }));
};

const parseForts = () => {
  const data = fs.readFileSync("./input/forts.txt");

  const images = parseFortImages();

  type Fort = {
    name: string;
    slug: string;
    category: string;
    progress: number;
    description: string;
    imageUrl: string;
  };

  let assignedSlugs: Fort[] = [];

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

          let slug = slugify(name);
          if (
            assignedSlugs.some(
              (f) => f.slug === slug && f.category === category.trim()
            )
          ) {
            console.log(`Duplicate slug: ${slug}`);
            for (let i = 2; i < 100; i++) {
              const newSlug = `${slug}-${i}`;
              if (
                !assignedSlugs.some(
                  (f) => f.slug === newSlug && f.category === category.trim()
                )
              ) {
                slug = newSlug;
                break;
              }
            }
          }

          let imageUrl = "";

          if (category.trim() === "enemy") {
            const image = images.find((image) => image.slug === slug);
            if (image) {
              imageUrl = image.url;
            }
          }

          const data = {
            name: name.trim(),
            slug,
            category: category.trim(),
            progress: +progress,
            description: description.trim(),
            imageUrl,
          };

          assignedSlugs.push(data);

          if (data.category === "enemy" && !data.imageUrl)
            console.log(`${+data.progress}%: ${slug}`);

          return data;
        });
    })
    .flat(3)
    .sort((a, b) => a.progress - b.progress);

  fs.writeFileSync("./output/forts.json", JSON.stringify(parsed, null, 4));
};

// parseAchievements();
// parsePerks();
// parseUtilities();
parseForts();
