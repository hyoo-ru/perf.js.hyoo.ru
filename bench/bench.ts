namespace $ {
	
	export class $hyoo_js_perf_bench extends $hyoo_crowd_struct {
		
		@ $mol_mem
		title( next?: string ) {
			return this.sub( 'title', $hyoo_crowd_reg ).str( next )
		}
		
		@ $mol_mem
		prefix( next?: string ) {
			return this.sub( 'prefix', $hyoo_crowd_reg ).str( next )
		}
		
		@ $mol_mem
		postfix( next?: string ) {
			return this.sub( 'postfix', $hyoo_crowd_reg ).str( next )
		}
		
		@ $mol_mem
		cases() {
			return this.sub( 'cases', $hyoo_crowd_list ).nodes( $hyoo_js_perf_case )
		}
		
		case_ensure( index: number ) {
			return this.cases()[ index ] ?? this.case_add()
		}
		
		@ $mol_action
		case_add() {
			this.sub( 'cases', $hyoo_crowd_list ).insert([ {} ])
			return this.cases().slice( -1 )[0]
		}
		
		@ $mol_action
		case_drop( index: number ) {
			this.sub( 'cases', $hyoo_crowd_list ).cut( index )
		}
		
		@ $mol_action
		case_dupe( index: number ) {
			this.sub( 'cases', $hyoo_crowd_list ).insert( [ {} ], index + 1 )
			const [ prev, next ] = this.cases().slice( index, index + 2 )
			next.steal( prev )
			return next
		}
		
		@ $mol_action
		case_swap( index: number ) {
			const list = this.sub( 'cases', $hyoo_crowd_list )
			const pos = index ? index - 1 : list.units().length
			list.move( index, pos )
			return pos
		}
		
		@ $mol_action
		steal( donor: $hyoo_js_perf_bench ) {
			
			this.title( donor.title() )
			this.prefix( donor.prefix() )
			this.postfix( donor.postfix() )
			
			for( const _case of donor.cases() ) {
				this.case_add().steal( _case )
			}
			
		}
		
		@ $mol_mem
		changable() {
			return this.land.level( '' ) >= $hyoo_crowd_peer_level.mod
		}
		
	}

}
