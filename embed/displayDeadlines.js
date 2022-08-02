const moment = require("moment");

const displayEmbed = (courses) => {
  let embed = {
    title: "All Courses",
    description: "ECE 2A Course Deadlines",
    color: 5144927,
    footer: {
      icon_url: "https://i.ibb.co/vxV3GXw/4UHvPXk.png",
      text: "ECE Discord Bot | Contact Admins For Support",
    },
    thumbnail: {
      url: "https://i.ibb.co/vxV3GXw/4UHvPXk.png",
    },
    fields: [],
  };

  courses.forEach((course) => {
    let course_embed = {
      name: course.courseCode,
      value: "",
    };
    course.deadlineArray.forEach((deadline) => {
      let formattedDate = new Date(deadline.date);
      let daylightSavings = moment(formattedDate).isDST();
      formattedDate = moment(formattedDate)
        .add(5 - daylightSavings, "hours")
        .format("MMMM D, h:mm A");

      course_embed.value += `• ${deadline.title} - ${formattedDate}\n`;
      if (deadline.desc) {
        course_embed.value += `‎ ‎ ‎ ‎ ‎ ‎- ${deadline.desc}\n`;
      }
    });
    if (course_embed.value !== "") {
      embed.fields.push(course_embed);
    }
  });
  return embed;
};

module.exports = displayEmbed;
