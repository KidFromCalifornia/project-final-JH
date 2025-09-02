# Accessibility (a11y) Setup

This project has accessibility tools configured to help maintain good practices.

## Tools

1. **ESLint with jsx-a11y Plugin**
   - Run with `npm run a11y` to check for issues
   - Configured in `eslint.config.js`

2. **React-axe**
   - Automatically checks accessibility in the browser console during development
   - Only active in development mode

## Key Accessibility Practices

1. **Semantic HTML**: Use the right elements for their intended purpose
   - Use `<button>` for buttons, not `<div>`
   - Use headings (`<h1>-<h6>`) in the correct order

2. **Images**: Always include alt text
   ```jsx
   <img src="coffee.jpg" alt="A cup of specialty coffee" />
   ```

3. **Keyboard Navigation**: Make sure users can navigate with keyboard
   - Test with Tab, Enter, Space, and arrow keys
   - Focus should be visible

4. **ARIA Attributes**: Use only when necessary
   - Follow the "first rule of ARIA": don't use ARIA if HTML can do it

5. **Color Contrast**: Maintain sufficient contrast
   - Use tools like WebAIM's contrast checker

## Resources

- [WebAIM](https://webaim.org/) - Web accessibility resources
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
