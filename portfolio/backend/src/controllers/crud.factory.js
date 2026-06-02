// Generic CRUD controller factory for simple resources.
export const crud = (Model) => ({
  list: async (req, res) => {
    const { q, limit = 50, page = 1, sort = '-createdAt' } = req.query;
    const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }] } : {};
    const docs = await Model.find(filter).sort(sort).limit(+limit).skip((+page - 1) * +limit);
    const total = await Model.countDocuments(filter);
    res.json({ data: docs, total, page: +page });
  },
  get: async (req, res) => {
    const doc = await Model.findOne({ $or: [{ _id: isObjectId(req.params.id) ? req.params.id : null }, { slug: req.params.id }] });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  },
  create: async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  },
  update: async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  },
  remove: async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  },
});

function isObjectId(v) {
  return /^[a-f\d]{24}$/i.test(v || '');
}
