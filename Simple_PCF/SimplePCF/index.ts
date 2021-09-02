/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable padded-blocks */
/* eslint-disable no-undef */

import { IInputs, IOutputs } from './generated/ManifestTypes'
import Inputmask from 'inputmask'

export class SimplePCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _ssnProperty : ComponentFramework.PropertyTypes.StringProperty;
  private _ssnPropertyValue : string | undefined;
  private _ssnIsValid : boolean;

  private _inputElement: HTMLInputElement;
  private _submitElement: HTMLElement;
  private _errorElement: HTMLElement;

  refresh: (ctx: ComponentFramework.Context<IInputs>) => void;
  output: () => IOutputs;

  public init (context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void {
    this._ssnProperty = context.parameters.ssn
    this._ssnPropertyValue = context.parameters.ssn.raw ? context.parameters.ssn.raw : undefined

    this._inputElement = document.createElement('input')
    this._inputElement.setAttribute('type', 'text')
	this._inputElement.setAttribute('id', 'inputcontrol')
    this._inputElement.setAttribute('class', 'pcfinputcontrol')

	// eslint-disable-next-line quotes
	const mask = "999999-9999"

    this._inputElement.onkeyup = () => {
      notifyOutputChanged()
      this.onInputChangeHandler(Inputmask.unmask(this._inputElement.value, { mask: mask }))
    }

	this._submitElement = document.createElement('span')
	this._submitElement.setAttribute('class', 'pcfimagecontrol fa')
	this._submitElement.setAttribute('height', '24px')
	this._submitElement.classList.add('fa-search')

	this._submitElement.onclick = () => {
		notifyOutputChanged()
		this.onInputChangeHandler(Inputmask.unmask(this._inputElement.value, { mask: mask }))
	}

	this._errorElement = document.createElement('div')
	this._errorElement.setAttribute('class', 'pcferrorcontroldiv')
	const errorChild1 = document.createElement('label')
	errorChild1.setAttribute('class', 'pcferrorcontrolimage')
	errorChild1.innerText = ' '

	const errorChild2 = document.createElement('label')
	errorChild2.setAttribute('class', 'pcferrorcontrollabel')
	errorChild2.innerText = 'Kennitalan er ekki gild.'

	this._errorElement.appendChild(errorChild1)
	this._errorElement.appendChild(errorChild2)
	this._errorElement.style.display = 'none'

	container.appendChild(this._inputElement)
	container.appendChild(this._submitElement)
	container.appendChild(this._errorElement)

	if (context.parameters.ssn.raw) {
		this._inputElement.value = context.parameters.ssn.raw
		this.onInputChangeHandler(this._inputElement.value)
	}

	this.refresh = (ctx) => {
		Inputmask({ mask: mask }).mask(this._inputElement)
	}

	this.output = () => {
		return {
			ssn: (mask)
				? Inputmask.unmask(this._inputElement.value, { mask: mask })
				: this._inputElement.value
		}
	}

  }

  public updateView (context: ComponentFramework.Context<IInputs>): void {
	this.refresh(context)
  }

  public getOutputs (): IOutputs {
    return this.output()
  }

  public destroy (): void {
    // Add code to cleanup control if necessary
  }

  private onInputChangeHandler (value : string) {
    if (value && value.length === 10) {
		if (this.islSSNValid(value)) {
			this._submitElement.classList.add('success')
			this._submitElement.classList.add('fa-check-circle')
			this._submitElement.classList.remove('fa-search')
			this._errorElement.style.display = 'none'
			this._ssnIsValid = true
			this._ssnPropertyValue = value
		} else {
			this._submitElement.classList.add('error')
			this._submitElement.classList.add('fa-exclamation-circle')
			this._submitElement.classList.remove('fa-search')
			this._ssnIsValid = false
			this._ssnPropertyValue = undefined
		}
    } else {
		this._errorElement.style.display = 'none'
		this._submitElement.classList.add('fa-search')
		this._submitElement.classList.remove('fa-check-circle')
		this._submitElement.classList.remove('fa-exclamation-circle')
		this._submitElement.classList.remove('error')
		this._submitElement.classList.remove('success')
		this._ssnPropertyValue = undefined
    }
  }

  private islSSNValid (ssn: string) : boolean {
    if (typeof ssn !== 'undefined' && ssn != null && ssn.length > 0) {
      ssn = ssn.trim().replace('-', '').replace(' ', '')
      if (ssn.length !== 10) {
        return false
      }
      const sSum =
        (3 * parseInt(ssn.substr(0, 1))) +
        (2 * parseInt(ssn.substr(1, 1))) +
        (7 * parseInt(ssn.substr(2, 1))) +
        (6 * parseInt(ssn.substr(3, 1))) +
        (5 * parseInt(ssn.substr(4, 1))) +
        (4 * parseInt(ssn.substr(5, 1))) +
        (3 * parseInt(ssn.substr(6, 1))) +
        (2 * parseInt(ssn.substr(7, 1)))
      let modRes = sSum % 11
      if (modRes > 0) {
        modRes = 11 - modRes
      }
      if (modRes !== parseInt(ssn.substr(8, 1))) {
        return false
      }
      const century = parseInt(ssn.substr(9, 1))
      if (isNaN(century) || (century !== 0 && century !== 9 && century !== 8)) {
        return false
      }
    }
    return true
  }

}
