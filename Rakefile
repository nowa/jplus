require 'rake'
require 'rake/packagetask'

JPLUS_ROOT      = File.expand_path(File.dirname(__FILE__))
JPLUS_SRC_DIR   = File.join(JPLUS_ROOT, 'src')
JPLUS_DIST_DIR  = File.join(JPLUS_ROOT, 'dist')
JPLUS_PKG_DIR   = File.join(JPLUS_ROOT, 'pkg')
JPLUS_VERSION   = '0.1.0.2'

task :default => [:dist, :package, :clean_package_source]

desc "Builds the distribution."
task :dist do
  $:.unshift File.join(JPLUS_ROOT, 'lib')
  require 'protodoc'
  
  Dir.chdir(File.join(JPLUS_SRC_DIR, 'core')) do
    File.open(File.join(JPLUS_DIST_DIR, 'jplus.js'), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new('jplus.js')
    end
  end
end

desc "Builds the distribution with utilities."
task :dist_util do
  
end

Rake::PackageTask.new('jplus', JPLUS_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = JPLUS_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'dist/jplus.js',
    'lib/**',
    'src/**',
    'test/**'
  )
end