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

export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!income) return res.status(404).json({ message: "Income not found" });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income", error: error.message });
  }
};

