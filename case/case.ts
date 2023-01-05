namespace $ {
	
	export class $hyoo_js_perf_case extends $hyoo_crowd_struct {
		
		@ $mol_mem
		title( next?: string ) {
			return this.sub( 'title', $hyoo_crowd_reg ).str( next )
		}
		
		@ $mol_mem
		setup( next?: string ) {
			return this.sub( 'setup', $hyoo_crowd_reg ).str( next )
		}
		
		@ $mol_mem
		measure( next?: string ) {
			return this.sub( 'measure', $hyoo_crowd_reg ).str( next )
		}
		
		@ $mol_action
		steal( donor: $hyoo_js_perf_case ) {
			this.title( donor.title() )
			this.setup( donor.setup() )
			this.measure( donor.measure() )
		}
		
	}

}
