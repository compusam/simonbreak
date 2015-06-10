var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

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
    var rawMarkup = marked(this.props.children.toString(), {sanitize:true});
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
    );
  }
});

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    var commentNodes = this.props.data.map(function(comment){
      return (
       React.createElement("div", {className: "commentList"}, 
         React.createElement(Comment, {author: comment.author}, comment.text)
       )
      );
    })
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
  React.createElement(MeasuresBox, {data: data}),
  document.getElementById('content')
);