
const Accounts = require('./accounts-model');

// Hesap verilerini doğrula
function checkAccountPayload(req, res, next) {
  const { name, budget } = req.body || {};

  // Name veya budget eksikse
  if (
    name === undefined ||
    name === null ||
    budget === undefined ||
    budget === null
  ) {
    return res.status(400).json({
      message: 'name and budget are required',
    });
  }

  // Name kontrolü
  const trimmedName =
    typeof name === 'string' ? name.trim() : '';

  if (
    trimmedName.length < 3 ||
    trimmedName.length > 100
  ) {
    return res.status(400).json({
      message: 'name of account must be between 3 and 100',
    });
  }

  // Budget sayı mı?
  const numericBudget = Number(budget);

  if (
    (typeof budget === 'string' && !budget.trim()) ||
    !Number.isFinite(numericBudget)
  ) {
    return res.status(400).json({
      message: 'budget of account must be a number',
    });
  }

  // Budget aralık kontrolü
  if (numericBudget < 0 || numericBudget > 1000000) {
    return res.status(400).json({
      message: 'budget of account is too large or too small',
    });
  }

  // Temizlenmiş verileri request'e aktar
  req.body.name = trimmedName;
  req.body.budget = numericBudget;

  next();
}

// ID kontrolü
async function checkAccountId(req, res, next) {
  try {
    const account = await Accounts.getById(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: 'account not found',
      });
    }

    req.account = account;
    next();
  } catch (error) {
    next(error);
  }
}

// Aynı isimde hesap var mı?
async function checkAccountNameUnique(req, res, next) {
  try {
    const trimmedName = req.body.name.trim();

    const accounts = await Accounts.getAll();

    const existingAccount = accounts.find(
      (account) => account.name === trimmedName
    );

    // Güncellemede aynı hesabın mevcut adı kabul edilir
    if (
      existingAccount &&
      String(existingAccount.id) !== String(req.params.id)
    ) {
      return res.status(400).json({
        message: 'that name is taken',
      });
    }

    req.body.name = trimmedName;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique,
};
