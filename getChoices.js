module.exports = {
    data: async function getArray() {
        const courseOptions = await deadlineModel.find({}, { courseCode: 1, _id: 0 });
        return courseOptions;
      }
}

