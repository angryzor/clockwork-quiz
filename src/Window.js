import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { CacheProvider } from '@emotion/core'
import createCache from '@emotion/cache'

class Window extends Component {
	containerElement = document.createElement('div')
	headElement = document.createElement('head')
	emotionCache = createCache({ container: this.headElement, key: 'viewport' })
	window = null

	componentDidMount() {
		this.window = window.open('', '', 'width=600,height=400,left=200,top=200')

		const document = this.window.document

		document.body.appendChild(this.containerElement)
		document.head.parentElement.replaceChild(this.headElement, document.head)

		Array.from(window.document.styleSheets).forEach(styleSheet => {
			if (styleSheet.cssRules) { // for <style> elements
				const newStyleEl = window.document.createElement('style')

				Array.from(styleSheet.cssRules).forEach(cssRule => {
					// write the text of each rule into the body of the style element
					newStyleEl.appendChild(window.document.createTextNode(cssRule.cssText))
				})

				document.head.appendChild(newStyleEl)
			} else if (styleSheet.href) { // for <link> elements loading CSS from a URL
				const newLinkEl = window.document.createElement('link')

				newLinkEl.rel = 'stylesheet'
				newLinkEl.href = styleSheet.href
				document.head.appendChild(newLinkEl)
			}
		})
	}

	componentWillUnmount() {
		this.window.close();
	}

	render() {
		return <CacheProvider value={this.emotionCache}>
			{ReactDOM.createPortal(
				this.props.children,
				this.containerElement,
			)}
		</CacheProvider>
	}
}

export default Window