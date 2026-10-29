
const db = require('../../data/dbConfig');

// Tüm hesapları getir
function getAll() {
  return db('accounts');
}

// ID'ye göre hesap getir
function getById(id) {
  return db('accounts')
    .where({ id })
    .first();
}

// Yeni hesap oluştur
async function create(account) {
  const [id] = await db('accounts')
    .insert(account);

  return getById(id);
}

// Hesap güncelle
async function updateById(id, changes) {
  const updatedCount = await db('accounts')
    .where({ id })
    .update(changes);

  if (!updatedCount) {
    return undefined;
  }

  return getById(id);
}

// Hesabı sil
async function deleteById(id) {
  const account = await getById(id);

  if (!account) {
    return undefined;
  }

  await db('accounts')
    .where({ id })
    .del();

  return account;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
