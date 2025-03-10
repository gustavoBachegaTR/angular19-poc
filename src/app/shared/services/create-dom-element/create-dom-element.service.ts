import { Injectable, TemplateRef, ApplicationRef, Type, ComponentRef, createComponent, inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CreateDomElementService {
    appRef = inject(ApplicationRef)

    /**
     * Get the default container if placeToShow is not defined.
     * @param placeToShow html element where will be placed the element.
     * @returns the HtmlElement where will be placed the element and true if is the default behavior, otherwise false.
     */
    private defaultContainer(placeToShow?: HTMLElement): [HTMLElement, boolean] {
        if (placeToShow) {
            return [placeToShow, false];
        } else {
            // Create a DOM element to host the modal
            const container = document.createElement('div');
            container.className = 'element-container';
            document.body.appendChild(container);
            return [container, true];
        }

    }

    /**
     * Add in the dom (end of the body by default) a template based on the attributes send.
     * @param templateRef template to be displayed.
     * @param placeToShow place where template will be appended 'appendChild'.
     * @returns return close(milliseconds) method to close and destroy the element created in the Dom.
     */
    createTemplate(templateRef: TemplateRef<any>, placeToShow?: HTMLElement): ElementResponse {
        // Create a DOM element to append the modal template

        const [container, isDefault] = this.defaultContainer(placeToShow);

        // Create an embedded view from the template
        const view = templateRef.createEmbeddedView({});
        const rootNode = (view.rootNodes[0] as HTMLElement);

        // Attach the view to the ApplicationRef
        this.appRef.attachView(view);

        // Append modal content to the container
        container.appendChild(rootNode);

        return {
            close: (milliseconds: number = 0) => {
                // Clean up: detach the view and destroy the view
                setTimeout(() => {
                    this.appRef.detachView(view);
                    view.destroy();
                    if (isDefault)
                        document.body.removeChild(container)
                }, milliseconds);
            }
        };
    }

    /**
     * Add in the dom (end of the body by default) a templated based on a component and the attributes send.
     * @param component component to be created and displayed.
     * @param context data to set to the component instance.
     * @param placeToShow place where template will be appended 'appendChild'.
     * @returns return close(milliseconds) method to close and destroy the element created in the Dom, in addition returns the instance of the component created.
     */
    createComponent<T>(component: Type<T>, context: Partial<T> = {}, placeToShow?: HTMLElement): ElementComponentResponse<T> {

        const [container, isDefault] = this.defaultContainer(placeToShow);

        // Dynamically create the component
        const componentRef: ComponentRef<T> = createComponent(component, {
            environmentInjector: this.appRef.injector,
        });

        // Pass inputs (context) to the component
        Object.assign((componentRef as any).instance, context);

        // Attach the component to the Angular application
        this.appRef.attachView(componentRef.hostView);

        // Append the component's root element to the container
        container.appendChild((componentRef.hostView as any).rootNodes[0]);

        return {
            instance: componentRef.instance,
            close: (milliseconds: number = 0) => {
                // Clean up: detach and destroy the component, and destroy the component
                setTimeout(() => {
                    this.appRef.detachView(componentRef.hostView);
                    componentRef.destroy();
                    if (isDefault)
                        document.body.removeChild(container)
                }, milliseconds);
            }
        };
    }
}

export interface ElementResponse {
    close: (milliseconds?: number) => void;
}


export interface ElementComponentResponse<T> extends ElementResponse {
    instance: T;
}