
const express = require('express');
const router = express.Router();

const Accounts = require('./accounts-model');

const {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique,
} = require('./accounts-middleware');

// GET /api/accounts
// Tüm hesapları getir
router.get('/', async (req, res, next) => {
  try {
    let accounts = await Accounts.getAll();

    const { limit, sortby, sortdir } = req.query;

    // Zorlayıcı görev: Sıralama
    if (sortby) {
      const allowedColumns = ['id', 'name', 'budget'];

      if (!allowedColumns.includes(sortby)) {
        return res.status(400).json({
          message: 'invalid sortby',
        });
      }

      const direction =
        String(sortdir).toLowerCase() === 'desc'
          ? 'desc'
          : 'asc';

      accounts = [...accounts].sort((a, b) => {
        let comparison = 0;

        if (sortby === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else {
          comparison =
            Number(a[sortby]) - Number(b[sortby]);
        }

        return direction === 'desc'
          ? -comparison
          : comparison;
      });
    }

    // Zorlayıcı görev: Limit
    if (limit !== undefined) {
      const parsedLimit = Number(limit);

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 0
      ) {
        return res.status(400).json({
          message: 'invalid limit',
        });
      }

      accounts = accounts.slice(0, parsedLimit);
    }

    res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
});

// GET /api/accounts/:id
router.get(
  '/:id',
  checkAccountId,
  (req, res) => {
    res.status(200).json(req.account);
  }
);

// POST /api/accounts
router.post(
  '/',
  checkAccountPayload,
  checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const newAccount = await Accounts.create(req.body);

      res.status(201).json(newAccount);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/accounts/:id
router.put(
  '/:id',
  checkAccountId,
  checkAccountPayload,
  checkAccountNameUnique,
  async (req, res, next) => {
    try {
      const updatedAccount = await Accounts.updateById(
        req.params.id,
        req.body
      );

      res.status(200).json(updatedAccount);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/accounts/:id
router.delete(
  '/:id',
  checkAccountId,
  async (req, res, next) => {
    try {
      const deletedAccount = await Accounts.deleteById(
        req.params.id
      );

      res.status(200).json(deletedAccount);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
