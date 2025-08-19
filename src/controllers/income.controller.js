const { Income } = db;

export const getIncomes = async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = { user_id: req.user.id };

    if (start && end) {
      where.income_date = { [db.Sequelize.Op.between]: [start, end] };
    }

    const incomes = await Income.findAll({ where, order: [["income_date", "DESC"]] });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incomes", error: error.message });
  }
};

