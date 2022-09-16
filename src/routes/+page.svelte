<script lang="ts">
	// @ts-nocheck

	import { onMount } from 'svelte';
	import {default as cytoscape} from 'cytoscape';
	import {default as nodetextedit} from '$lib/index.js';
 

	onMount(() => {
		var cy = (window['cy'] = cytoscape({
			container: document.getElementById('cy'),

			layout: {
				name: 'grid',
				rows: 2,
				cols: 2
			},

			style: [
				{
					selector: 'node[name]',
					style: {
						content: 'data(name)',
						'text-events': 'yes',
						'text-wrap': 'wrap',
						'text-max-width': '402',
						'text-justification': 'center'
					}
				},

				{
					selector: 'edge',
					style: {
						'curve-style': 'bezier',
						'target-arrow-shape': 'triangle'
					}
				}
			],

			elements: {
				nodes: [
					{ data: { id: 'j', name: 'Jerry' } },
					{
						data: {
							id: 'e',
							name: 'Reason with longer text but it should be broken down into lines'
						}
					},
					{ data: { id: 'k', name: 'Kramer' } },
					{ data: { id: 'g', name: 'George' } }
				],
				edges: [{ data: { source: 'j', target: 'e' } }]
			}
		}));
		 

        cytoscape.use(nodetextedit);
		window.cy_nte = cy.nodetextedit({
			showLogs: true,
			selectAllText: true,
			nodeLabel: "name"
		});
	});
	function closeEdit() {
		if (window.cy_nte) {
			window.cy_nte.closeEditing();
		}
	}

	function changeText(newText) {
		if (window.cy_nte) {
			window.cy_nte.changeEditBoxText(newText);
		}
	}
</script>

<div id="cy-container">
	<div id="controls">
		<button type="button" onclick={closeEdit}>Close editing</button>
		<button type="button" onclick={() => changeText('Testing')}>Change text</button>
	</div>

	<div id="cy" />
</div>

<style>
	* {
		font-family: helvetica neue, helvetica, liberation sans, arial, sans-serif;
		font-size: 14px;
	}
	#cy-container {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	#cy {
		flex: 1;
	}


	button {
		z-index: 1000;
	}
</style>
