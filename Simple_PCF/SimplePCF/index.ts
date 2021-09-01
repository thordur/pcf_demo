/* eslint-disable padded-blocks */
/* eslint-disable no-undef */

import { IInputs, IOutputs } from './generated/ManifestTypes'

export class SimplePCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  public init (context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void {
    console.log('init')
  }

  public updateView (context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view
  }

  public getOutputs (): IOutputs {
    return {}
  }

  public destroy (): void {
    // Add code to cleanup control if necessary
  }
}
