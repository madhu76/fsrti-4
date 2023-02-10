
import {Validator , NG_VALIDATORS , AbstractControl} from '@angular/forms';
import {Directive, Input} from '@angular/core';

@Directive({
    selector:'[confirmEqualValidator]',
    providers:[{
        provide:NG_VALIDATORS,
        useExisting:ConfirmPasswordMatchDirective,
        multi:true
    }]
})

export class ConfirmPasswordMatchDirective implements Validator{
    @Input() confirmEqualValidator:string;
    validate(control:AbstractControl) : {[key:string]:any} | null
    {
        const pswrd = control.parent.get(this.confirmEqualValidator)
        if(pswrd && pswrd.value !== control.value)
        {
            return {'notEqual':true};
        }

        return null;
    }
}