export const Info = () => {
  return (
    <div className='info-container'>
      <div>
        <h1>Map Controllers guide</h1>
      </div>
      <div className='info-block'>
        <p>
          <span>To add marker:</span> You need to Left-click on the map.
        </p>
        <p>
          <span>To delete a marker:</span>
          Move the cursor over the marker and right-click.
        </p>
        <p>
          <span>To delete all markers:</span>
          Click the Remove All Markers button.
        </p>
        <p>
          <span>To drag-and-drop a marker:</span>
          Move the cursor over the marker, hold down the left mouse button, and
          move the marker on the map.
        </p>
      </div>
    </div>
  );
};
