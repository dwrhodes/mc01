Recommendations = new Mongo.Collection("recommendations");

function getMonthlyRate(rate) {
  return (rate / 100.0) / 12.0;
}

if (Meteor.isClient) {
  //Session.setDefault("noteRate", 0.0);
  //Session.setDefault("monthlyRate", 0.0);

  Template.rate.helpers({
    recommendation: function() {
      return Recommendations.findOne(Session.get("rec"));
    } //,
    //monthlyRate: function() {
    //  return getMonthlyRate(Session.get("noteRate"));
    //}
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
    'blur #noteRate': function (event) {
      //Session.set("noteRate", event.target.value);
      //alert(this._id);
      alert( "Target value: " + event.target.value);
      Meteor.call("calculateMonthlyRate", this._id, event.target.value);
      return false;
    }

  });
}

Meteor.methods({
  calculateMonthlyRate: function (recId, noteRate) {
    var rec = Recommendations.findOne(recId);
    var monthlyRate = getMonthlyRate(rec.noteRate);
//    Meteor.call("calculateMonthlyRate", this._id, event.target.value);
    Recommendations.update(recId, { $set: {
      noteRate: noteRate,
      monthlyRate: monthlyRate
    }})
  }
});
