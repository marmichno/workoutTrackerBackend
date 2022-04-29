export const getMany = (model) => async (req, res) => {
  try {
    const docs = await model.find({ createdBy: req.user._id }).lean().exec();
    res.status(200).json({ data: docs });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const createOne = (model) => async (req, res) => {
  const createdBy = req.user._id;
  try {
    const doc = await model.create({ ...req.body, createdBy });
    res.status(201).json({ data: doc });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const removeOne = (model) => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      _id: req.params.id,
    });

    if (!removed) {
      return res.status(400).end();
    }

    return res.status(200).json({ data: removed });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const updateOne = (model) => async (req, res) => {
  try {
    const updated = await model.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
      },
      req.body,
      { new: true }
    );
    if (!doc) {
      return res.status(400).send({ message: "cant find document to update" });
    }
    res.status(200).json({ data: updated });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const crudControllers = (model) => ({
  getMany: getMany(model),
  createOne: createOne(model),
  removeOne: removeOne(model),
  updateOne: updateOne(model),
});
