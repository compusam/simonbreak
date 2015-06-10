var MeasuresBox = React.createClass({displayName: "MeasuresBox",
  render: function(){
    return(
      React.createElement("div", {className: "measuresBox"}, 
      "Hi, please, put your measures here"
      )
    );
  }
});
React.render(
  React.createElement(MeasuresBox, null),
  document.getElementById('content')
);