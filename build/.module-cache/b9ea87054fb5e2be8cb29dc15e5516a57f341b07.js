var MeasuresBox = React.createClass({displayName: "MeasuresBox",
  render: function(){
    return(
      React.createElement("div", {className: "measuresBox"}, 
        React.createElement(CommentList, null), 
        React.createElement(CommentForm, null)
      )
    );
  }
});
React.render(
  React.createElement(MeasuresBox, null),
  document.getElementById('content')
);

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    return (
      React.createElement("div", {className: "commentList"}, 
        "Hello, world! I am a CommentList."
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  render: function() {
    return (
      React.createElement("div", {className: "commentForm"}, 
        "Hello, world! I am a CommentForm."
      )
    );
  }
});