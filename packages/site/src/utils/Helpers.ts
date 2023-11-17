/**
 * Returns the value of the given CSS property for the body.
 *
 * #### Example:
 * `getCssPropValue("width");`
 *
 * `getCssPropValue("--font-size");`
 *
 * @param propName CSS property name
 * @returns string - Value of the CSS property for the body.
 */
export const getCssPropValue = (propName: string) => {
  return (
    window
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .getComputedStyle(document.getElementsByTagName('body')[0]!)
      .getPropertyValue(propName)
  );
};
