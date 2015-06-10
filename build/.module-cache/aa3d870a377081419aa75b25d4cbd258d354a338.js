var MeasuresBox = React.createClass({displayName: "MeasuresBox",
  render: function(){
    return (
      React.createElement("div", {className: "measuresBox"}, 
       
        React.createElement(CommentList, null), 
        React.createElement(CommentForm, null)
      )
    );
  }
});

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        marked(this.props.children.toString())
      )
    );
  }
});

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    return (
      React.createElement("div", {className: "commentList"}, 
        React.createElement(Comment, {author: "Pete Hunt"}, "First Comment"), 
        React.createElement(Comment, {author: "Jordan Walke"}, "Another Comment")
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

React.render(
  React.createElement(MeasuresBox, null),
  document.getElementById('content')
);