const axios = require("axios");
const url = require("url");
const cheerio = require("cheerio");

const urlLink = "https://ww6.mangakakalot.tv";

const dataCollector = async (req, res, next) => {
  try {
    const response = await axios.get(
      `${urlLink}/manga_list?type=latest&category=None&state=None&page=1`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 10000,
      }
    );

    const html = response.data;
    const $ = cheerio.load(html);

    const category = [];
    const type = [];
    const state = [];

    // CATEGORY
    $(".truyen-list .tag:eq(0) li a").each((index, val) => {
      const target = $(val);
      const id = url.parse(target.attr("href"), true).query.category;

      category.push({
        id: id,
        name: target.text(),
      });
    });

    // TYPE
    $(".truyen-list .tag:eq(1) li a").each((index, val) => {
      const target = $(val);
      const id = url.parse(target.attr("href"), true).query.type;

      type.push({
        id: id,
        name: target.text(),
      });
    });

    // STATE
    $(".truyen-list .tag:eq(2) li a").each((index, val) => {
      const target = $(val);
      const id = url.parse(target.attr("href"), true).query.state;

      state.push({
        id: id,
        name: target.text(),
      });
    });

    req.metaData = {
      type,
      state,
      category,
    };

    next();
  } catch (e) {
    res.status(500).json({
      error: "Fetch failed",
      details: e.message,
    });
  }
};

module.exports = dataCollector;
