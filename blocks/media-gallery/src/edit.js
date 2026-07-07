import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import apiFetch from "@wordpress/api-fetch";
import { useState, useEffect } from "@wordpress/element";
import { ServerSideRender, useServerSideRender } from '@wordpress/server-side-render';
import { RawHTML } from '@wordpress/element';
import {
  Panel,
  PanelBody,
  PanelRow,
  CheckboxControl,
  Spinner,
  ColorPicker,
  __experimentalNumberControl as NumberControl
} from "@wordpress/components";

// Hide the gutenberg top bar when full screen
document.addEventListener("click", async (ev) => {
  var target = ev.target;

  if (target.matches(".media-item")) {
    document.querySelector(
      ".interface-interface-skeleton__header",
    ).style.zIndex = 0;
  }

  if (target.matches(".closebtn")) {
    document.querySelector(
      ".interface-interface-skeleton__header",
    ).style.zIndex = 30;
  }
});

var availableCats = [];
apiFetch({ path: "/wp/v2/attachment_cat" }).then( res => availableCats = res);

const Edit = ({ attributes, setAttributes }) => {
  const { categories, color, types, amount } = attributes;

  const onMediaTypeSelected = function (checked, type) {
    if (checked) {
      types.push(type)
    } else {
      types = types.filter((val) => val != type);
    }

    setAttributes({ types: [...types] });
  };

  const onCatChanged = function (checked, id) {
    let newCats = [...categories];
    if (checked) {
      newCats.push(id);
    } else if (!checked) {
      newCats = newCats.filter((val) => val != id);
    }

    setAttributes({ categories: newCats });
  };

  const buildCatChecks = () => {
     return availableCats.map((c) => (
      <CheckboxControl
        label    = {c.name}
        onChange = {(checked) => onCatChanged(checked, c.id)}
        checked  = {categories.includes(c.id)}
        key      = {c.id}
      />
    ));
  }

  const getServerSideRenderedContent = ( ) => {
    const { content, status, error } = useServerSideRender( {
        block: "tsjippy/media-gallery",
        attributes: attributes,
        urlQueryArgs: { context: 'edit' } // Optional custom query arguments
    } );

    const blockProps = useBlockProps();

    let html;

    if ( status === 'loading' ) {
        html = "Loading...";
    }

    else if ( status === 'error' ) {
        html = `Error: ${ error }`;
    }

    else{
      html  = <RawHTML>{ content }</RawHTML>; 
    }

    return <div {...blockProps}>
      { html }
    </div>;
  }

  return (
    <>
      <InspectorControls>
        <Panel>
          <PanelBody title="Media Types" initialOpen={true}>
            <PanelRow>
              Select the media types
            </PanelRow>
            <CheckboxControl
              label    = 'Audio'
              onChange = {(checked) => onMediaTypeSelected(checked, 'audio')}
              checked  = {types.includes('audio')}
              key      = 'audio'
            />
            <CheckboxControl
              label    = 'Image'
              onChange = {(checked) => onMediaTypeSelected(checked, 'image')}
              checked  = {types.includes('image')}
              key      = 'image'
            />
            <CheckboxControl
              label    = 'Video'
              onChange = {(checked) => onMediaTypeSelected(checked, 'video')}
              checked  = {types.includes('video')}
              key      = 'video'
            />
          </PanelBody>
          <PanelBody title="Amount Per Page" initialOpen={false}>
            <PanelRow>
              <NumberControl
                __next40pxDefaultSize
                onChange={ value => setAttributes({ amount: value }) }
                shiftStep={ 5 }
                value={ attributes.amount }
              />
            </PanelRow>
          </PanelBody>
          <PanelBody title="Background color" initialOpen={false}>
            <PanelRow>
              <ColorPicker
                color={color}
                onChange={(color) => setAttributes({ color: color })}
                enableAlpha
                defaultValue="#000"
              />
            </PanelRow>
          </PanelBody>
          <PanelBody title="Categories" initialOpen={false}>
            <PanelRow>
              Select a category you want to include media for
            </PanelRow>
            { buildCatChecks() }
          </PanelBody>
        </Panel>
      </InspectorControls>
      { getServerSideRenderedContent() }
    </>
  );
};

export default Edit;
