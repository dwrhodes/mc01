Recommendations = new Mongo.Collection("recommendations");

function getMonthlyRate(rate) {
  return (rate / 100.0) / 12.0;
}

if (Meteor.isClient) {

  Template.rate.helpers({
    currentRecommendation: function() {
      return Recommendations.findOne(Session.get("rec"));
    }
  });

  Template.body.helpers({
    recs: function() {
      var rec = Recommendations.find({});
      return rec;
    }
  });

  Template.rate.events({
    'click #new': function () {
      var recId = Recommendations.insert({
        noteRate: 0.0,
        monthlyRate: 0.0
      });
      Session.set("rec", recId);
      return false;
    },
    'click #remove': function() {
      Recommendations.remove();
    },
    'blur #noteRate': function (event) {
      Meteor.call("calculateMonthlyRate", this._id, event.target.value);
      return false;
    }

  });
}

Meteor.methods({
  calculateMonthlyRate: function (recId, noteRate) {
    var monthlyRate = getMonthlyRate(noteRate);
    Recommendations.update(recId, { $set: {
      noteRate: noteRate,
      monthlyRate: monthlyRate
    }})
  }
});
