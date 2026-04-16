const cheerio = require("cheerio");

const mangaController = (req, res) => {
  try {
    const $ = cheerio.load(req.html);
    const target = $(".manga-info-top");

    const metaData = {
      imageUrl:
        "https://ww6.mangakakalot.tv/" +
        target.find(".manga-info-pic img").attr("src"),
      name: target.find(".manga-info-text li:eq(0) h1").text(),
      author: target.find(".manga-info-text li:eq(1) a").text(),
      status: target.find(".manga-info-text li:eq(2)").text().split(":")[1]?.trim(),
      updated: target.find(".manga-info-text li:eq(3)").text().split(":")[1]?.trim(),
      view: target.find(".manga-info-text li:eq(5)").text().split(":")[1]?.trim(),
      genres: target
        .find(".manga-info-text li:eq(6)")
        .text()
        .split(":")[1]
        ?.split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    };

    const chapterList = [];

    $(".chapter-list .row").each((i, el) => {
      chapterList.push({
        title: $(el).find("a").text(),
        link: $(el).find("a").attr("href"),
        date: $(el).find("span").last().text(),
      });
    });

    res.json({
      ...metaData,
      chapterList,
    });
  } catch (err) {
    res.status(500).json({
      error: "Parsing failed",
      details: err.message,
    });
  }
};

module.exports = mangaController;
