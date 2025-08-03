import pathlib, json

webapp_root = pathlib.Path('./public')
embeddings = webapp_root.joinpath('embeddings')

def get_fpFormat(format: str) -> dict[str, int] | str:
	if format.startswith('float8'):
		return { 'eBits': int(format.split('_e')[1].split('m')[0]) }
	else:
		return 'standard'


captures = []
for embedding in embeddings.iterdir():
	if embedding.is_dir():
		metadata_file = embedding.joinpath('capture.json')
		if metadata_file.exists():
			metadata = json.load(metadata_file.open())
			ts_metadata = {
				'name': metadata.get('name'),
				'frameCount': metadata.get('frameCount'),
				'classes': [{ 'name': name, 'image': '/' + str(embedding.joinpath(image).relative_to(webapp_root)) } for name, image in metadata.get('classes', [])],

				'variations': [
					{
						'name': v.get('name'),
						'path': '/' + str(embedding.joinpath(f'data-{i}.np').relative_to(webapp_root)),
						'fpFormat': get_fpFormat(v.get('format', 'float32')),
						'deltaEncoded': v.get('deltaEncoded'),
						'channels': v.get('channels')
					} for i, v in enumerate(metadata.get('variations', []))
				]
			}

			captures.append(ts_metadata)


with open('lib/captures.json', 'w') as f:
	json.dump(captures, f, indent=2)
	f.write('\n')
