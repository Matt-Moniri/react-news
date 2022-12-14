/* Create 7 API calls and when all are done, call the createChartUrl
to create a url that will be used as the "src" of the <img> on the homePage
which will show the chart  */
import { fetchData } from "./fetchData.js";
import { createChartUrl } from "./createChartUrl.js";
export const fetchStats = async (_) => {
  _.setChartIsLoading(true);
  let daysBeforeToday = [0, 1, 2, 3, 4, 5, 6];
  let x = 0;
  let requests = [];
  let statsLabled = [];
  daysBeforeToday.forEach(async (day) => {
    let fetchParams = {
      tags: "story",
      numericFilters: `created_at_i>${(
        new Date().getTime() / 1000 -
        (day + 1) * 24 * 3600
      ) //from a day in seconds
        .toString()},created_at_i<${(
        new Date().getTime() / 1000 -
        day * 24 * 3600
      ) //upto next day in seconds
        .toString()}`,
    };

    requests.push(
      await new Promise((resolve, reject) => {
        let endPoint = "https://hn.algolia.com/api/v1/search?";
        fetchData(endPoint, fetchParams)
          .then((response) => {
            statsLabled = [
              ...statsLabled,
              { day: day, nbHits: response.nbHits },
            ];
            x += 1;
            resolve();
          })
          .catch((error) => {
            console.log(error);
            x += 1;
            reject();
          });
      })
    );
    if (x === 7) {
      statsLabled = statsLabled.sort((a, b) => {
        return b.day - a.day;
      });
      let stats = [];
      statsLabled.forEach((labledStat) => {
        stats.push(labledStat.nbHits);
      });
      //_.setStats(stats);
      createChartUrl(stats, _);
    }
  });
};
