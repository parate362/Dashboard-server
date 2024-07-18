const NewData = require('../models/pieChartData');

exports.generateData = async (req, res) => {
  const { year, month, week } = req.body;
  const platforms = ['Instagram', 'YouTube', 'Facebook'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weeks = ['week1', 'week2', 'week3', 'week4'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Validate the month and week
  if (month && !months.includes(month)) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }
  if (week && !weeks.includes(week)) {
    return res.status(400).json({ message: 'Invalid week provided' });
  }

  const data = [];

  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    for (let m = 0; m < months.length; m++) {
      if (month && month !== months[m]) continue; // Skip if month does not match

      for (let w = 0; w < weeks.length; w++) {
        if (week && week !== weeks[w]) continue; // Skip if week does not match

        for (let d = 0; d < days.length; d++) {
          const likes = Math.floor(Math.random() * 1000);
          const views = Math.floor(Math.random() * 10000);

          data.push({ 
            platform, 
            likes, 
            views, 
            year, 
            month: months[m], 
            week: weeks[w],
            day: days[d] // Add day of the week
          });
        }
      }
    }
  }

  try {
    await NewData.insertMany(data);
    res.status(201).json({ message: 'Data generated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPerformanceMeasure = async (req, res) => {
  try {
    const { type, year, value } = req.query;
    const query = { 
      platform: { $in: ['Instagram', 'YouTube', 'Facebook'] },
      year: parseInt(year),
    };

    if (type === 'weeks') {
      query.week = value;
    } else if (type === 'months') {
      query.month = value;
    }

    let data = await NewData.find(query);

    // Transform data for chart
    const groupedData = data.reduce((acc, item) => {
      const key = type === 'weeks' ? item.day : item.month; // Group by day or month
      if (!acc[key]) {
        acc[key] = { likes: 0, views: 0 };
      }
      acc[key].likes += item.likes;
      acc[key].views += item.views;
      return acc;
    }, {});

    // Convert to array of objects
    const formattedData = Object.keys(groupedData).map(key => ({
      [type === 'weeks' ? 'day' : 'month']: key,
      likes: groupedData[key].likes,
      views: groupedData[key].views,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
