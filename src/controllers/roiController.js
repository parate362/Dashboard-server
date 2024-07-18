const express = require('express');
const router = express.Router();
const RoiData = require('../models/RoiData');

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Function to generate random likes and views for each day
const generateDailyData = () => {
  const dailyData = [];
  days.forEach(dayOfWeek => {
    const likes = Math.floor(Math.random() * 1000);
    const views = Math.floor(Math.random() * 10000);
    const amt = views - likes; // Calculating ROI as views - likes

    dailyData.push({ likes, views, amt });
  });
  return dailyData;
};

// Add data for each day of the week
exports.generateData = async (req, res) => {
  try {
    const { platform, year, month, week } = req.body;

    const dataToInsert = [];

    weeks.forEach(weekName => {
      const weeklyData = generateDailyData();

      days.forEach((day, index) => {
        const newYear = year || 2020 + Math.floor(Math.random() * 10); // Random year between 2020 and 2029
        const newMonth = month || months[Math.floor(Math.random() * months.length)];
        const newWeek = week || weekName;

        dataToInsert.push({
          platform,
          likes: weeklyData[index].likes,
          views: weeklyData[index].views,
          year: newYear,
          month: newMonth,
          week: newWeek,
          day,
          amt: weeklyData[index].amt, // Store calculated ROI
        });
      });
    });

    const newData = await RoiData.insertMany(dataToInsert);

    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get data and calculate ROI metrics
exports.calculateROI = async (req, res) => {
  try {
    const { platform, year, month, week, day } = req.query;
    const query = {};

    if (platform) query.platform = platform;
    if (year) query.year = Number(year);
    if (month) query.month = month;
    if (week) query.week = week;
    if (day) query.day = day;

    const data = await RoiData.find(query);

    // Calculate metrics
    let totalTarget = 0;
    let currentTarget = 0;

    data.forEach(item => {
      totalTarget += item.likes; // Assuming likes represent investment amount
      currentTarget += item.views; // Assuming views represent current value
    });

    const totalReturns = currentTarget - totalTarget;
    const totalProfitOrLoss = (totalReturns / totalTarget) * 100;

    res.status(200).json({
      data,
      totalTarget,
      currentTarget,
      totalReturns,
      totalProfitOrLoss,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

