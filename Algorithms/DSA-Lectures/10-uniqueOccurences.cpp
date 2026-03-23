#include<iostream>
using namespace std;

bool isUnique( int arr[], int size){
    int counts[1000]=0;
    for(int i=0; i<size; i++){
        int temp=arr[i];
        counts[temp]+=1;
    }
    for(int j=0; j<1000; j++){
        if(counts[j]%2==0){
            return false;
        }
    }
    return true;
}

int main()
{
    int array[6]={1,2,2,1,1,3};
    int brray[2]={1,2};
    cout<<isUnique(array, 6);
    cout<<isUnique(brray, 2);
    
    return 0;
}