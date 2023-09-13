namespace $.$$ {
	export class $hyoo_js_perf_case_row extends $.$hyoo_js_perf_case_row {

		@ $mol_mem
		columns() {
			return [
				this.Prefix(),
				this.Source(),
				... this.results().length > 1
					? [ this.Results() ]
					: this.source()
						? [ this.Eval_labeler() ]
						: [ this.Results() ]
			]
		}

		result( level : number ) {
			return this.results()[ level ]
		}

		result_title( level : number ) {
			return [ '🔠', '🥶' , '🥵' ][ level ] ?? ''
		}
		
		eval_standalone() {
			const code = this.sample()
			return `https://eval.js.hyoo.ru/#!code=${ encodeURIComponent( code ) }/run=true`
		}
		
		edit_tools() {
			return this.changable() ? super.edit_tools() : []
		}
		
		@ $mol_mem
		prefix_showed( next?: boolean ): boolean {
			return next
				?? $mol_wire_probe( ()=> this.prefix_showed() )
				?? this.prefix().split( '\n' ).length <= 2
		}
		
		@ $mol_mem
		source_showed( next?: boolean ): boolean {
			return next
				?? $mol_wire_probe( ()=> this.source_showed() )
				?? this.source().split( '\n' ).length <= 2
		}
		
	}
}
