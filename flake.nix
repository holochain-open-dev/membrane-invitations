{
  description = "Template for Holochain app development";

  inputs = {
    versions.url  = "github:holochain/holochain/holochain-0.3.0-beta-dev.26?dir=versions/weekly";

    holochain-flake.url = "github:holochain/holochain/holochain-0.3.0-beta-dev.26";
    holochain-flake.inputs.versions.follows = "versions";
    holochain-flake.inputs.holochain.url = "github:holochain/holochain/holochain-0.3.0-beta-dev.26";

    nixpkgs.follows = "holochain-flake/nixpkgs";
    flake-parts.follows = "holochain-flake/flake-parts";
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake
      {
        inherit inputs;
      }
      {
        systems = builtins.attrNames inputs.holochain-flake.devShells;
        perSystem =
          { inputs'
          , config
          , pkgs
          , system
          , ...
          }: {
            devShells.default = pkgs.mkShell {
              inputsFrom = [ inputs'.holochain-flake.devShells.holonix ];
              packages = with pkgs; [
                nodejs-18_x
                nodePackages.pnpm
                # more packages go here
                cargo-nextest
              ];

              shellHook = ''
                unset CARGO_TARGET_DIR
                unset CARGO_HOME
              '';
            };
          };
      };
}
